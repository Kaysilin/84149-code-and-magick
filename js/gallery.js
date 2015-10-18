'use strict';

(function() {
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
   * min и max. Возвращает value которое будет не меньше min
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
   * Конструктор объекта фотогалереи. Создает свойства, хранящие ссылки на элементы
   * галереи, служебные данные (номер показанной фотографии и список фотографий)
   * и фиксирует контекст у обработчиков событий.
   * @constructor
   */
  var Gallery = function() {
    this._element = document.querySelector('.overlay-gallery');
    this._closeButton = this._element.querySelector('.overlay-gallery-close');
    this._leftButton = this._element.querySelector('.overlay-gallery-control-left');
    this._rightButton = this._element.querySelector('.overlay-gallery-control-right');
    this._pictureElement = this._element.querySelector('.overlay-gallery-preview');

    this._currentPhoto = -1;
    this._photos = [];

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onLeftArrowClick = this._onLeftArrowClick.bind(this);
    this._onRightArrowClick = this._onRightArrowClick.bind(this);
  };

  Gallery.prototype.setPhotos = function() {
    var galleryImages = document.querySelector('.photogallery').getElementsByTagName('img');

    for (var i = 0; i < galleryImages.length; i++) {
      this._photos.push(galleryImages[i].src);
    }

    var totalImageNumber = this._element.querySelector('.preview-number-total');
    totalImageNumber.innerHTML = this._photos.length.toString();
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);

    if ((this._currentPhoto === index) || (index === -1)) {
      return;
    }
    this._currentPhoto = index;

    this._pictureElement.style.backgroundImage = 'url(\'' + this._photos[this._currentPhoto] + '\')';
    this._pictureElement.style.backgroundRepeat = 'no-repeat';

    var newImage = new Image();
    newImage.src = this._photos[this._currentPhoto];
    if (newImage.width > newImage.height) {
      this._pictureElement.style.backgroundSize = 'auto 100%';
    } else {
      this._pictureElement.style.backgroundSize = '100% auto';
    }

    var currentImageNumber = this._element.querySelector('.preview-number-current');
    currentImageNumber.innerHTML = this._currentPhoto + 1;
  };

  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');

    this._closeButton.addEventListener('click', this._onCloseButtonClick);
    this._leftButton.addEventListener('click', this._onLeftArrowClick);
    this._rightButton.addEventListener('click', this._onRightArrowClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');

    this._closeButton.removeEventListener('click', this._onCloseButtonClick);
    this._leftButton.removeEventListener('click', this._onLeftArrowClick);
    this._rightButton.removeEventListener('click', this._onRightArrowClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);

    this._currentPhoto = -1;
    this._photos = [];
  };

  Gallery.prototype._onCloseButtonClick = function() {
    this.hide();
  };

  Gallery.prototype._onLeftArrowClick = function() {
    this.setCurrentPhoto(clamp(this._currentPhoto - 1, 0, this._photos.length - 1));
  };

  Gallery.prototype._onRightArrowClick = function() {
    this.setCurrentPhoto(clamp(this._currentPhoto + 1, 0, this._photos.length - 1));
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        this.setCurrentPhoto(clamp(this._currentPhoto - 1, 0, this._photos.length - 1));
        console.log('previous photo shown');
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(clamp(this._currentPhoto + 1, 0, this._photos.length - 1));
        console.log('next photo shown');
        break;
      case Key.ESC:
        this.hide();
        break;
      default: break;
    }
  };

  window.Gallery = Gallery;

  var galleryContainer = document.querySelector('.photogallery');

  galleryContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (evt.target.localName === 'img') {
      if (!newGallery) {
        var newGallery = new Gallery();
        newGallery.setPhotos();
      }

      var currentPhoto = galleryContainer.querySelectorAll('.photogallery-image img');
      var currentPhotoArr = Array.prototype.slice.call(currentPhoto);

      newGallery.setCurrentPhoto(currentPhotoArr.indexOf(evt.target));
      newGallery.show();
    }
  });

})();
