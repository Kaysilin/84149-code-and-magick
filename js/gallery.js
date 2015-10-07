'use strict';

(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var galleryContainer = document.querySelector('.photogallery');
  var galleryOverlay = document.querySelector('.overlay-gallery');
  var closeButton = galleryOverlay.querySelector('.overlay-gallery-close');

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

  galleryContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (evt.target.localName === 'img') {
      showGallery();
    }
  });

})();
