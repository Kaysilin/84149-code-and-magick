/* global Backbone: true */

'use strict';

define(function() {
  /**
   * Таймаут на получение ответа на запрос
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * Маппинг рейтинга и классов для контейнера
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
   * Шаблон отзыва
   * @type {Element}
   */
  var reviewTemplate = document.getElementById('review-template');

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var ReviewView = Backbone.View.extend({
    /**
    * @override
    */
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onModelUseful = this._onModelUseful.bind(this);
      this._onClick = this._onClick.bind(this);

      this.model.on('change:review-rating', this._onModelUseful);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click': '_onClick'
    },

    /**
     * Тег, использующийся для элемента представления.
     * @type {string}
     * @override
     */
    tagName: 'article',

    /**
     * Класс элемента.
     * @type {string}
     * @override
     */
    className: 'review',

    /**
     * Отрисовка отзыва
     * @override
     */
    render: function() {
      // Клонирование нового объекта для отзыва из шаблона и заполнение его реальными
      // данными, взятыми из свойства _data, созданного конструктором.
      this.el.appendChild(reviewTemplate.content.children[0].cloneNode(true));
      this.el.querySelector('.review-rating').classList.add(reviewRatingClassName[this.model.get('rating')]);
      this.el.querySelector('.review-text').textContent = this.model.get('description');

      if (this.model.get('author')['picture']) {

        var reviewImage = new Image();

        reviewImage.src = this.model.get('author')['picture'];
        reviewImage.alt = this.model.get('author')['name'];
        reviewImage.title = this.model.get('author')['name'];
        reviewImage.height = reviewImage.width = '124';

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('review-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        reviewImage.addEventListener('load', this._onImageLoad);
        reviewImage.addEventListener('error', this._onImageFail);
        reviewImage.addEventListener('abort', this._onImageFail);
      }

      this._updateUseful();
    },


    /**
     * Обработчик кликов по элементу.
     * @param {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      var clickedElement = evt.target;

      // Клик по оценке полезности отзыва, вызывает изменение
      // рейтинга отзыва. Если ранее уже нажималась,
      // старые изменения убираются, новые добавляются.
      if (clickedElement.classList.contains('review-quiz-answer-yes')) {      this.model.useful();
      }

      if (clickedElement.classList.contains('review-quiz-answer-no')) {
        this.model.unuseful();
       }
    },

    /**
     * Обработчик статусаа загрузки изображения отзыва
     * @param {Event} evt
     * @private
     */
    _onImageLoad: function(evt) {
      clearTimeout(this._imageLoadTimeout);

      var loadedImage = evt.path[0];
      loadedImage.classList.add('review-author');
      this._cleanupImageListeners(loadedImage);

      this.el.childNodes[0].replaceChild(loadedImage, this.el.querySelector('img'));
    },

    /**
     * Обработчик неудачной загрузки изображения
     * @param {Event} evt
     * @private
     */
    _onImageFail: function(evt) {
      var failedImage = evt.path[0];
      this._cleanupImageListeners(failedImage);

      this.el.classList.add('review-load-failure');
    },

    /**
     * Обработчик изменени оценки отзыва
     * @private
     */
    _onModelUseful: function() {
      this._updateUseful();
    },

    /**
     * Актуализация состояний кнопок оценки отзыва
     * после клика полезный да/нет
     * @private
     */
    _updateUseful: function() {
      var usefulButtonYes = this.el.querySelector('.review-quiz-answer-yes');
      var usefulButtonNo = this.el.querySelector('.review-quiz-answer-no');

      if (usefulButtonYes && usefulButtonNo) {
        usefulButtonYes.classList.toggle('review-quiz-answer-checked', this.model.get('rate-review') === true);
        usefulButtonNo.classList.toggle('review-quiz-answer-checked', this.model.get('rate-review') === false);
      }
    },

    /**
     * Удаление обработчиков событий на элементе.
     * @param {Image} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  return ReviewView;
});
