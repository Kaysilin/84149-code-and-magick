"use strict";

(function() {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviews;

  reviewsFilter.classList.add('invisible');

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
          if (loadedXhr.status == 200) {
            var data = loadedXhr.response;
            reviewsContainer.classList.remove('reviews-list-loading');
            callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    }
  }

  function renderReviews(reviews) {

    reviewsFilter.classList.add('invisible');
    reviewsContainer.innerHTML = '';

    if (reviews) {
      var reviewRatingClassName = {
        '': 'review-rating-none',
        '0': 'review-rating-none',
        '1': 'review-rating-one',
        '2': 'review-rating-two',
        '3': 'review-rating-three',
        '4': 'review-rating-four',
        '5': 'review-rating-five'
      };

      var reviewTemplate = document.getElementById('review-template');
      var reviewsFragment = document.createDocumentFragment();

      reviews.forEach(function (review) {
        var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);

        newReviewElement.querySelector('.review-rating').classList.add(reviewRatingClassName[review['rating']]);
        newReviewElement.querySelector('.review-text').textContent = review['description'];

        if (review['author']['picture']) {

          var reviewImage = new Image();

          reviewImage.src = review['author']['picture'];

          var imageLoadTimeout = setTimeout(function() {
            newReviewElement.classList.add('review-load-failure');
          }, REQUEST_FAILURE_TIMEOUT);

          reviewImage.onload = function () {
            clearTimeout(imageLoadTimeout);
            reviewImage.classList.add('review-author');
            reviewImage.alt = review['author']['name'];
            reviewImage.title = review['author']['name'];
            reviewImage.height = reviewImage.width = '124';
            newReviewElement.replaceChild(reviewImage, newReviewElement.querySelector('img'));
          };

          reviewImage.onerror = function () {
            newReviewElement.classList.add('review-load-failure');
          };
        }

        reviewsFragment.appendChild(newReviewElement);
      });

      reviewsContainer.appendChild(reviewsFragment);
      reviewsFilter.classList.remove('invisible');
    }
  }

  function filterReviews(reviews, filterID) {
    var filteredReviews = reviews.slice(0);
    switch (filterID) {
      case 'reviews-recent':
        var HALF_YEAR_PERIOD = 365*24*60*60*1000/2;
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
        filteredReviews = filteredReviews.filter(function(item){
          var sortDate = new Date(item.date.replace(/-/g, ', '));
          var sortDateCurrent = new Date();
          if (sortDate > new Date(sortDateCurrent - HALF_YEAR_PERIOD)) {
            return item;
          }
        });
        break;

      case 'reviews-good':
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
        filteredReviews = filteredReviews.filter(function(item){
          if (+item.rating > 2) {
            return item;
          }
        });
        break;

      case 'reviews-bad':
        filteredReviews = filteredReviews.sort(function(a, b) {
          if ((a.rating < b.rating) || (b.rating == false)) {
            return -1;
          }

          if ((a.rating > b.rating) || (a.rating == false)) {
            return 1;
          }

          if (a.rating === b.rating) {
            return 0;
          }
        });
        filteredReviews = filteredReviews.filter(function(item){
          if (+item.rating < 3) {
            return item;
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
        filteredReviews = reviews.slice(0);
        break;
    }

    return filteredReviews;
  }

  function initFilters() {
    var filterElement = document.forms['reviews-filter']['reviews'];
    console.log(filterElement.value);
    document.forms['reviews-filter'].onclick = function (evt) {
      setActiveFilter(evt.target.value);
    }
  }

  function setActiveFilter(filterId) {
    var filteredReviews = filterReviews(reviews, filterId);
    renderReviews(filteredReviews);
  }

  initFilters();

  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    renderReviews(reviews);
    setActiveFilter('sort-hotels-default');
  });
}) ();
