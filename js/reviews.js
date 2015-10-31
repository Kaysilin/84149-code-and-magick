'use strict';

define([
  'models/reviews',
  'views/review'
], function(ReviewsCollection, ReviewView) {
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
   * Объект кэша для отфитрованных отзывов
   * @type {Object}
   */
  var filteredReviewsCache = {};

  /**
   * Выводит на страницу список отзывов поблочно.
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
        //reviewsContainer.removeChild(viewToRemove.el);
        viewToRemove.remove();
      }
    }

    reviewsCollection.slice(reviewsFrom, reviewsTo).forEach(function(model) {
      var view = new ReviewView({ model: model });
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
   * Добавляет класс ошибки контейнеру с отзывами.
   * Используется в случае, если произошла ошибка
   * загрузки отзывов или загрузка прервалась
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

    if (filteredReviewsCache[filterID]) {
      reviewsCollection.reset(filteredReviewsCache[filterID]);
      console.log('got from cache');
    } else {
      switch (filterID) {
        case 'reviews-recent':
          var HALF_YEAR_PERIOD = 365 * 24 * 60 * 60 * 1000 / 2;
          list = list.filter(function (item) {
            var sortDate = new Date(item.date.replace(/-/g, ', '));
            var sortDateCurrent = new Date();
            if (sortDate > new Date(sortDateCurrent - HALF_YEAR_PERIOD)) {
              console.log('filter');
              return item;
            }
          });
          list.sort(function (a, b) {
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
          list = list.filter(function (item) {
            if (+item.rating > 2) {
              return item;
            }
          });
          list.sort(function (a, b) {
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
          list = list.filter(function (item) {
            if (+item.rating < 3) {
              return item;
            }
          });
          list.sort(function (a, b) {
            if ((a.rating < b.rating) && (a.rating !== 0) || (b.rating === 0)) {
              return -1;
            }
            if ((a.rating > b.rating) && (b.rating !== 0) || (a.rating === 0)) {
              return 1;
            }
            if (a.rating === b.rating) {
              return 0;
            }
          });
          break;

        case 'reviews-popular':
          list.sort(function (a, b) {
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
      filteredReviewsCache[filterID] = list;
      reviewsCollection.reset(list);
    }
  }

  /**
   * Вызывает функцию фильтрации на списке отелей с переданным fitlerID
   * и подсвечивает кнопку активного фильтра.
   * @param {string} filterId
   */
  function setActiveFilter(filterId) {
    reviewsFilter['reviews'].value = filterId;
    filterReviews(filterId);
    currentPage = 0;
    renderReviews(++currentPage, true);
  }

  /**
   * Проверка наличия отзывов в коллекции для заполнения
   * следующей страницы (блока)
   * @returns {boolean}
   */
  function isNextPageAvailable() {
    return currentPage < Math.ceil(reviewsCollection.length / PAGE_LENGTH);
  }

  /**
   * Инициализация подписки на клики по кнопкам фильтра.
   * Используется делегирование событий: события обрабатываются
   * на объекте, содержащем все фильтры,
   * * и в момент наступления события, проверяется,
   * произошел ли клик по фильтру или нет и если да,
   * то вызывается функция установки фильтра.
   */
  function initFilters() {
    parseURL();
    reviewsFilter.addEventListener('click', function(evt) {
      if (evt.target.name === 'reviews') {
        location.hash = 'filters/' + evt.target.value;
      }
    });
  }

  /**
   * Проверка наличия хеша, отвечающего за тип фильтра отзывов,
   * в адресной строке.
   * Если он есть, устанавливается соответствующий фильтр,
   * если нет - дефолтный.
   */
  function parseURL() {
    var filterHash = location.hash.match(/^#filters\/(\S+)$/);
    if (filterHash) {
      setActiveFilter(filterHash[1]);
    } else {
      setActiveFilter('reviews-all');
    }
  }

  /**
   * Подписка на клики по кнопке Еще отзывы.
   * Если доступна следующая страница - выводим следующий блок отзывов.
   */
  reviewsMore.addEventListener('click', function() {
    if (isNextPageAvailable()) {
      renderReviews(++currentPage, false);
    }
  });

  /**
   * Получение списка отзывов из коллекции.
   * В случае успеха проверка хеша и инициализация фильтров.
   */
  reviewsCollection.fetch({ timeout: REQUEST_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    window.addEventListener('hashchange', parseURL);
    initFilters();
  }).fail(function() {
    showLoadFailure();
  });

});
