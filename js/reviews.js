'use strict';

(function() {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var PAGE_LENGTH = 3;

  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsMore = document.querySelector('.reviews-controls-more');
  var reviews;
  var currentReviews;
  var currentPage = 0;

  reviewsFilter.classList.add('invisible');
  reviewsMore.classList.add('invisible');

  function showLoadFailure() {
    reviewsContainer.classList.add('reviews-load-failure');
  }

  function loadReviews(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/reviews.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          reviewsContainer.classList.add('reviews-list-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            reviewsContainer.classList.remove('reviews-list-loading');
            return callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    };
  }

  /**
   * Список отрисованных отзывов. Используется для обращения к каждому
   * из отзывов для удаления его со страницы.
   * @type {Array.<Review>}
   */
  var renderedReviews = [];

  /**
   * Выводит на страницу список отзывов постранично(поблочно).
   * @param {Array.<Object>} reviewsAll
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderReviews(reviewsAll, pageNumber, replace) {

    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      var elem;
      while ((elem = renderedReviews.shift())) {
        elem.unrender();
      }

      reviewsContainer.classList.remove('review-load-failure');
      reviewsFilter.classList.add('invisible');
      reviewsMore.classList.add('invisible');
      //reviewsContainer.innerHTML = '';
      pageNumber = 1;
    }

    var reviewsFragment = document.createDocumentFragment();

    var reviewsFrom = (pageNumber - 1) * PAGE_LENGTH;
    var reviewsTo = reviewsFrom + PAGE_LENGTH;
    reviewsAll = reviewsAll.slice(reviewsFrom, reviewsTo);

    reviewsAll.forEach(function(review) {
      var newReviewElement = new Review(review);
      newReviewElement.render(reviewsFragment);
      renderedReviews.push(newReviewElement);
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
   * Фильтрация списка отзывов. Принимает на вход список отзывов
   * и ID фильтра. В зависимости от переданного ID применяет
   * разные алгоритмы фильтрации. Возвращает отфильтрованный
   * список и записывает примененный фильтр в localStorage.
   * Не изменяет исходный массив.
   * @param {Array.<Object>} reviewsAll
   * @param {string} filterID
   * @return {Array.<Object>}
   */
  function filterReviews(reviewsAll, filterID) {
    var filteredReviews = reviewsAll.slice(0);
    switch (filterID) {
      case 'reviews-recent':
        var HALF_YEAR_PERIOD = 365 * 24 * 60 * 60 * 1000 / 2;
        filteredReviews = filteredReviews.filter(function(item) {
          var sortDate = new Date(item.date.replace(/-/g, ', '));
          var sortDateCurrent = new Date();
          if (sortDate > new Date(sortDateCurrent - HALF_YEAR_PERIOD)) {
            return item;
          }
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
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
        filteredReviews = filteredReviews.filter(function(item) {
          if (+item.rating > 2) {
            return item;
          }
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
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
        filteredReviews = filteredReviews.filter(function(item) {
          if (+item.rating < 3) {
            return item;
          }
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
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
        filteredReviews = filteredReviews.sort(function(a, b) {
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
        filteredReviews = reviewsAll.slice(0);
        break;
    }
    localStorage.setItem('filterID', filterID);
    return filteredReviews;
  }

  function setActiveFilter(filterId) {
    currentReviews = filterReviews(reviews, filterId);
    currentPage = 0;
    renderReviews(currentReviews, ++currentPage, true);
  }

  function initFilters() {
    var filtersContainer = document.forms['reviews-filter'];
    filtersContainer['reviews'].value = localStorage.getItem('filterID');
    filtersContainer.addEventListener('click', function(evt) {
      if (evt.target.name === 'reviews') {
        setActiveFilter(evt.target.value);
      }
    });
  }

  initFilters();

  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    currentReviews = reviews;
    setActiveFilter(localStorage.getItem('filterID'));
  });

  function isNextPageAvailable() {
    return currentPage < Math.ceil(currentReviews.length / PAGE_LENGTH);
  }

  reviewsMore.addEventListener('click', function() {
    if (isNextPageAvailable()) {
      renderReviews(currentReviews, ++currentPage, false);
    }
  });
})();
