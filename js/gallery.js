/* global Backbone: true */

'use strict';

define([
  'views/photo',
  'views/video'
], function(GalleryView, GalleryVideoView) {
  /**
   * Список констант кодов нажатых клавиш для обработки
   * клавиатурных событий.
   * @enum {number}
   */
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * Функция, "зажимающая" переданное значение value между значениями
   * min и max. Возвращает value, которое будет не меньше min
   * и не больше max.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Конструктор объекта фотогалереи. Создает свойства, хранящие ссылки
   * на элементы алереи, служебные данные (номер показанной фотографии
   * и список фотографий) и фиксирует контекст у обработчиков событий.
   * @constructor
   */
  var Gallery = function() {
    this._element = document.querySelector('.overlay-gallery');
    this._closeButton = this._element.querySelector('.overlay-gallery-close');
    this._leftButton = this._element.querySelector('.overlay-gallery-control-left');
    this._rightButton = this._element.querySelector('.overlay-gallery-control-right');
    this._pictureElement = this._element.querySelector('.overlay-gallery-preview');

    this._currentPhoto = -1;
    this._photos = new Backbone.Collection();

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onLeftArrowClick = this._onLeftArrowClick.bind(this);
    this._onRightArrowClick = this._onRightArrowClick.bind(this);
  };

  /**
   * Записывает список ссылок на фото в приватное свойство _photos.
   * Также добавляет число, отражающее коидчетсво элементов в галерее,
   * в верстку.
   * @method setPhotos
   * @param {Array.<string>} aPhotos
   */
  Gallery.prototype.setPhotos = function(aPhotos) {
    //console.dir(aPhotos);
    for (var i = 0; i < aPhotos.length; i++) {
      //console.log(aPhotos[i].dataset);
      if (aPhotos[i].dataset.replacementVideo) {
        this._photos.add({
          url: aPhotos[i].dataset.replacementVideo,
          preview: aPhotos[i].src
        });
      } else {
        this._photos.add({
          url: aPhotos[i].src
        });
      }
      //console.dir(this._photos);
    }

    var totalImageNumber = this._element.querySelector('.preview-number-total');
    totalImageNumber.innerHTML = this._photos.length.toString();
  };

  /**
   * Устанавливает номер фотографии, которую нужно показать, предварительно
   * "зажав" его между 0 и количеством фотографий в галерее минус 1 (чтобы
   * нельзя было показать фотографию номер -1 или номер 100 в массиве
   * из четырех фотографий), и показывает ее на странице.
   * @method setCurrentPhoto
   * @param {number} index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {
    var videoContainer = this._pictureElement.getElementsByTagName('video')[0];
    console.dir(videoContainer);
    if (videoContainer) {
      console.log('ig');
      this._pictureElement.removeChild(videoContainer);
    }
    console.log(index);
    console.log(this._currentPhoto);
    index = clamp(index, 0, this._photos.length - 1);

    if ((this._currentPhoto === index) || (index === -1)) {
      return;
    }
    this._currentPhoto = index;

    if (this._photos.at(this._currentPhoto).get('preview')) {
      //console.log('preview');
      galleryView = new GalleryVideoView({model: this._photos.at(this._currentPhoto)});
    } else {
      var galleryView = new GalleryView({model: this._photos.at(this._currentPhoto)});
    }

    galleryView.setElement(this._pictureElement);
    galleryView.render();

    var currentImageNumber = this._element.querySelector('.preview-number-current');
    currentImageNumber.innerHTML = this._currentPhoto + 1;
  };

  /**
   * Показывает фотогалерею, убирая у контейнера класс invisible.
   * Добавляет обработчики событий.
   * @method show
   */
  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');

    this._closeButton.addEventListener('click', this._onCloseButtonClick);
    this._leftButton.addEventListener('click', this._onLeftArrowClick);
    this._rightButton.addEventListener('click', this._onRightArrowClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Скрывает фотогалерею, добавляя контейнеру класс invisible.
   * Удаляет обработчики событий.
   * @method hide
   */
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');

    this._closeButton.removeEventListener('click', this._onCloseButtonClick);
    this._leftButton.removeEventListener('click', this._onLeftArrowClick);
    this._rightButton.removeEventListener('click', this._onRightArrowClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype._onCloseButtonClick = function() {
    this.hide();
  };

  Gallery.prototype._onLeftArrowClick = function() {
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

  Gallery.prototype._onRightArrowClick = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        console.log('previous photo shown');
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        console.log('next photo shown');
        break;
      case Key.ESC:
        this.hide();
        break;
      default:
        break;
    }
  };

  var galleryContainer = document.querySelector('.photogallery');

  /**
   * @return {Array.<string>}
   */
  var getPhotos = function() {
    return Array.prototype.map.call(galleryContainer.querySelectorAll('.photogallery-image img'), function(pictureNode) {
      return pictureNode;
    });
  };

  galleryContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (evt.target.localName === 'img') {
      if (!newGallery) {
        var newGallery = new Gallery();
        newGallery.setPhotos(getPhotos());
      }

      newGallery.setCurrentPhoto(getPhotos().indexOf(evt.target));
      newGallery.show();
    }
  });
});
