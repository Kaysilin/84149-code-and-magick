"use strict";

(function() {

  var reviewsFilter = document.querySelector('.reviews-filter');

  reviewsFilter.classList.add('invisible');

  if (reviews) {

    var reviewRatingClassName = {
      '1': 'review-rating-one',
      '2': 'review-rating-two',
      '3': 'review-rating-three',
      '4': 'review-rating-four',
      '5': 'review-rating-five'
    };

    var IMAGE_FAILURE_TIMEOUT = 2000;

    var reviewsContainer = document.querySelector('.reviews-list');
    var reviewTemplate = document.getElementById('review-template');
    var reviewsFragment = document.createDocumentFragment();

    reviews.forEach(function(review){
      var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);

      newReviewElement.querySelector('.review-rating').classList.add(reviewRatingClassName[review['rating']]);
      newReviewElement.querySelector('.review-text').textContent = review['description'];

      if (review['author']['picture']) {

        var reviewImage = new Image();

        reviewImage.src = review['author']['picture'];

        var imageLoadTimeout = setTimeout(function() {
          newReviewElement.classList.add('review-load-failure');
        }, IMAGE_FAILURE_TIMEOUT);

        reviewImage.onload = function() {
          clearTimeout(imageLoadTimeout);
          reviewImage.classList.add('review-author');
          reviewImage.alt = review['author']['name'];
          reviewImage.title = review['author']['name'];
          reviewImage.height = reviewImage.width = '124';
          newReviewElement.replaceChild(reviewImage,newReviewElement.childNodes[1]);
        };

        reviewImage.onerror = function() {
          newReviewElement.classList.add('review-load-failure');
        };
      }

      reviewsFragment.appendChild(newReviewElement);
    });

    reviewsContainer.appendChild(reviewsFragment);
    reviewsFilter.classList.remove('invisible');
  }
}) ();