/*
 global
 Gallery: true
 ReviewsCollection: true
 ReviewView: true
 */

'use strict';

(function() {
  /**
   * Время таймаута
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * Количество отзывов на странице
   * @const
   * @type {number}
   */
  var PAGE_LENGTH = 3;

  /**
   * @type {number}
   */
  var currentPage = 0;

  /**
   * Контейнер списка отзывов.
   * @type {Element}
   */
  var reviewsContainer = document.querySelector('.reviews-list');

  /**
   * Контейнер списка фильтров.
   * @type {Element}
   */
  var reviewsFilter = document.querySelector('.reviews-filter');

  /**
   * Кнопка Еще отзывы.
   * @type {Element}
   */
  var reviewsMore = document.querySelector('.reviews-controls-more');
  /**
   * @type {ReviewsCollection}
   */
  var reviewsCollection = new ReviewsCollection();

  /**
   * @type {Array.<Object>}
   */
  var initiallyLoaded = [];

  /**
   * @type {Array.<ReviewView>}
   */
  var renderedViews = [];

  /**
   * Выводит на страницу список отзывов постранично(поблочно).
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderReviews(pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    var reviewsFragment = document.createDocumentFragment();
    var reviewsFrom = (pageNumber - 1) * PAGE_LENGTH;
    var reviewsTo = reviewsFrom + PAGE_LENGTH;

    if (replace) {
      while (renderedViews.length) {
        var viewToRemove = renderedViews.shift();
        // Важная особенность представлений бэкбона: remove занимается только удалением
        // обработчиков событий, по факту это метод, который нужен для того, чтобы
        // подчистить память после удаления элемента из дома. Добавление/удаление
        // элемента в DOM должно производиться вручную.
        reviewsContainer.removeChild(viewToRemove.el);
        viewToRemove.remove();
      }
    }

    reviewsCollection.slice(reviewsFrom, reviewsTo).forEach(function(model) {
      var view = new ReviewView({ model: model });
      // render только создает элемент в памяти, после этого его нужно
      // добавить в документ вручную.
      view.render();
      reviewsFragment.appendChild(view.el);
      renderedViews.push(view);
    });

    reviewsContainer.appendChild(reviewsFragment);
    reviewsFilter.classList.remove('invisible');
    if (isNextPageAvailable()) {
      reviewsMore.classList.remove('invisible');
    } else {
      reviewsMore.classList.add('invisible');
    }
  }

  /**
   * Добавляет класс ошибки контейнеру с отзывами. Используется в случае,
   * если произошла ошибка загрузки отзывов или загрузка прервалась
   * по таймауту.
   */
  function showLoadFailure() {
    reviewsContainer.classList.add('reviews-load-failure');
    reviewsFilter.classList.add('invisible');
    reviewsMore.classList.add('invisible');
  }

  /**
   * Фильтрация списка отзывов. Принимает на вход список отзывов
   * и ID фильтра. В зависимости от переданного ID применяет
   * разные алгоритмы фильтрации. Возвращает отфильтрованный
   * список и записывает примененный фильтр в localStorage.
   * Не изменяет исходный массив.
   * @param {string} filterID
   * @return {Array.<Object>}
   */
  function filterReviews(filterID) {
    var list = initiallyLoaded.slice(0);

    switch (filterID) {
      case 'reviews-recent':
        var HALF_YEAR_PERIOD = 365 * 24 * 60 * 60 * 1000 / 2;
        list = list.filter(function(item) {
          var sortDate = new Date(item.date.replace(/-/g, ', '));
          var sortDateCurrent = new Date();
          if (sortDate > new Date(sortDateCurrent - HALF_YEAR_PERIOD)) {
            console.log('filter');
            return item;
          }
        });
        list.sort(function(a, b) {
          var sortDateOne = new Date(a.date.replace(/-/g, ', '));
          var sortDateTwo = new Date(b.date.replace(/-/g, ', '));
          if (sortDateOne < sortDateTwo) {
            return 1;
          }
          if (sortDateOne > sortDateTwo) {
            return -1;
          }
          if (sortDateOne === sortDateTwo) {
            return 0;
          }
        });
        break;

      case 'reviews-good':
        list = list.filter(function(item) {
          if (+item.rating > 2) {
            return item;
          }
        });
        list.sort(function(a, b) {
          if (a.rating > b.rating) {
            return -1;
          }
          if (a.rating < b.rating) {
            return 1;
          }
          if (a.rating === b.rating) {
            return 0;
          }
        });
        break;

      case 'reviews-bad':
        list = list.filter(function(item) {
          if (+item.rating < 3) {
            return item;
          }
        });
        list.sort(function(a, b) {
          if ((a.rating < b.rating) && (a.rating !== 0) || (b.rating === 0)) {
            return -1;
          }
          if ((a.rating > b.rating) && (b.rating !== 0) || (a.rating === 0) ) {
            return 1;
          }
          if (a.rating === b.rating) {
            return 0;
          }
        });
        break;

      case 'reviews-popular':
        list.sort(function(a, b) {
          if (a['review-rating'] > b['review-rating']) {
            return -1;
          }
          if (a['review-rating'] < b['review-rating']) {
            return 1;
          }
          if (a['review-rating'] === b['review-rating']) {
            return 0;
          }
        });
        break;

      default:
        list.slice(0);
        break;
    }

    reviewsCollection.reset(list);
    //localStorage.setItem('filterID', filterID);
  }

  /**
   * Вызывает функцию фильтрации на списке отелей с переданным fitlerID
   * и подсвечивает кнопку активного фильтра.
   * @param {string} filterID
   */
  function setActiveFilter(filterId) {
    filterReviews(filterId);
    currentPage = 0;
    renderReviews(++currentPage, true);
  }

  function isNextPageAvailable() {
    return currentPage < Math.ceil(reviewsCollection.length / PAGE_LENGTH);
  }

  /**
   * Инициализация подписки на клики по кнопкам фильтра.
   * Используется делегирование событий: события обрабатываются на объекте,
   * содержащем все фильтры, и в момент наступления события, проверяется,
   * произошел ли клик по фильтру или нет и если да, то вызывается функция
   * установки фильтра.
   */
  function initFilters() {
    var filtersContainer = document.forms['reviews-filter'];
    filtersContainer['reviews'].value = parseURL();
    filtersContainer.addEventListener('click', function(evt) {
      if (evt.target.name === 'reviews') {
        location.hash = 'filters/' + evt.target.value;
      }
    });
  }

  function parseURL() {
    var filterHash = location.hash.match(/^#filters\/(\S+)$/);
    if (filterHash) {
      setActiveFilter(filterHash[1]);
      return filterHash[1];
    } else {
      setActiveFilter('sort-by-default');
      return 'sort-by-default';
    }
  }

  reviewsMore.addEventListener('click', function() {
    if (isNextPageAvailable()) {
      renderReviews(++currentPage, false);
    }
  });

  reviewsCollection.fetch({ timeout: REQUEST_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    window.addEventListener('hashchange', parseURL);
    initFilters();
  }).fail(function() {
    showLoadFailure();
  });

})();
