'use strict';

(function() {
  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @type {Object.<string, string>}
   */
  var reviewRatingClassName = {
    '': 'review-rating-none',
    '0': 'review-rating-none',
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  /**
   * @type {Element}
   */
  var reviewTemplate = document.getElementById('review-template');

  /**
   * Конструктор объектов типа Review. Кроме создания объекта, добавляет каждому объекту
   * свойство data_ и фиксирует контекст у обработчика события клика.
   * @constructor
   * @param {Object} data
   */
  var Review = function(data) {
    this._data = data;
  };

  /**
   * Создание DOM-элемента, отрисовка его в переданный контейнер.
   * @param  {Element|DocumentFragment} container
   */
  Review.prototype.render = function(container) {
      // Клонирование нового объекта для отзыва из шаблона и заполнение его реальными
      // данными, взятыми из свойства _data, созданного конструктором.
    var newReviewElement = reviewTemplate.content.children[0].cloneNode(true);
    newReviewElement.querySelector('.review-rating').classList.add(reviewRatingClassName[this._data['rating']]);
    newReviewElement.querySelector('.review-text').textContent = this._data['description'];

    if (this._data['author']['picture']) {

      var reviewImage = new Image();

      reviewImage.src = this._data['author']['picture'];
      reviewImage.classList.add('review-author');
      reviewImage.alt = this._data['author']['name'];
      reviewImage.title = this._data['author']['name'];
      reviewImage.height = reviewImage.width = '124';

      var imageLoadTimeout = setTimeout(function() {
        newReviewElement.classList.add('review-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);

      reviewImage.onload = function() {
        clearTimeout(imageLoadTimeout);
        newReviewElement.replaceChild(reviewImage, newReviewElement.querySelector('img'));
      };

      reviewImage.onerror = function() {
        newReviewElement.classList.add('review-load-failure');
      };
    }

    container.appendChild(newReviewElement);
    this._element = newReviewElement;
  };

  /**
   * Удаление DOM-элемента отзыва.
   */
  Review.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element = null;
  };

  // Экспорт конструктора объекта Review в глобальную область видимости.
  window.Review = Review;

})();
