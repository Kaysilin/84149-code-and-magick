/* global Backbone: true */

'use strict';

(function() {
  var galleryView = new Backbone.View.extend({
    el: this._pictureElement = this._element.querySelector('.overlay-gallery-preview'),

    render: function() {
      this.el.style.backgroundImage = 'url(\'' + this.model.get('url') + '\')';
      this.el.style.backgroundRepeat = 'no-repeat';

      var newImage = new Image();
      newImage.src = this.model.get('url');
      if (newImage.width > newImage.height) {
        this.el.style.backgroundSize = 'auto 100%';
      } else {
        this.el.style.backgroundSize = '100% auto';
      }

    }
  });
  window.galleryView = galleryView;
})();
