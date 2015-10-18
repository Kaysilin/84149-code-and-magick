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

    this._currentPhoto = 0;
    this._photos = [];

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onLeftArrowClick = this._onLeftArrowClick.bind(this);
    this._onRightArrowClick = this._onRightArrowClick.bind(this);
  };

  Gallery.prototype.setPhotos = function() {

  };

  Gallery.prototype.setCurrentPhoto = function() {

  };

  Gallery.prototype.show = function() {

  };

  Gallery.prototype.hide = function() {

  };

  Gallery.prototype._onCloseButtonClick = function() {

  };

  Gallery.prototype._onLeftArrowClick  = function() {

  };

  Gallery.prototype._onRightArrowClick = function() {

  };

  Gallery.prototype._onDocumentKeyDown = function() {

  };

  window.Gallery = Gallery;

  var newGallery;

  var galleryContainer = document.querySelector('.photogallery');
  //var galleryOverlay = document.querySelector('.overlay-gallery');
  //var closeButton = galleryOverlay.querySelector('.overlay-gallery-close');

  function closeHandler(evt) {
    evt.preventDefault();
    hideGallery();
  }

  function hideGallery() {
    galleryOverlay.classList.add('invisible');
    closeButton.removeEventListener('click', closeHandler);
    document.body.removeEventListener('keydown', keyHandler);
  }

  function showGallery() {
    galleryOverlay.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);
    document.body.addEventListener('keydown', keyHandler);
  }

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('previous photo shown');
        break;
      case Key.RIGHT:
        console.log('next photo shown');
        break;
      case Key.ESC:
        hideGallery();
        break;
      default: break;
    }
  }

  //////////////////////////////////////
  var galleryImages = document.querySelector('.photogallery').getElementsByTagName('img');
  var galleryImagesUrls = [];
  console.log(galleryImages.length);

  for (var i = 0; i < galleryImages.length; i++) {
    galleryImagesUrls.push(galleryImages[i].src);
  }
  /////////////////////////////////////

  galleryContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (evt.target.localName === 'img') {
      //showGallery();
      if (!newGallery) {
        newGallery = new Gallery();
        newGallery.setPhotos();
      }
      newGallery.setCurrentPhoto();
      newGallery.show();
    }
  });

})();
