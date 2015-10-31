/* global Backbone: true */

'use strict';

define(function() {
  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var GalleryView = Backbone.View.extend({
    /**
     * Отрисовка фото из галереи в оверлее
     * @override
     */
    render: function() {
      this._galleryPhoto = document.createElement('img');
      this._galleryPhoto.src = this.model.get('url');
      this._galleryPhoto.style.maxHeight = document.documentElement.clientHeight - 150 + 'px';
      this._galleryPhoto.style.maxWidth = document.documentElement.clientWidth - 150 + 'px';
      this.el.appendChild(this._galleryPhoto);
      return this;
    },

    /** @override */
    remove: function() {
      this.el.removeChild(this._galleryPhoto);
      this.stopListening();
      this.undelegateEvents();
      return this;
    }
  });

  return GalleryView;
});
