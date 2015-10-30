/* global Backbone: true */

'use strict';

define(function() {
  /**
   * @constructor
   * @extends {Backbone.View}
   * @global
   */
  var GalleryVideoView = Backbone.View.extend({
    /**
     * @override
     */
    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },
    /**
     * Маппинг событий, происходящих на элементе на названия методов обработчиков
     * событий.
     * @type {Object.<string, string>}
     */
    events: {
      'click': '_onClick'
    },

    /**
     * Отрисовка видео из галереи
     * @override
     */
    render: function() {
      this._galleryVideo = document.createElement('video');
      this._galleryVideo.src = this.model.get('url');
      this._galleryVideo.autoplay = true;
      this._galleryVideo.loop = true;
      this._galleryVideo.poster = this.model.get('preview');
      console.log(this.el);
      this.el.appendChild(this._galleryVideo);
      return this;
    },

    /**
     * Обработчик кликов по элементу.
     * @param {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      if (evt.target.paused === false) {
        evt.target.pause();
      } else {
        evt.target.play();
      }
    },

    /**
     * Удаление видео.
     * @override
     */
    remove: function() {
      this.el.removeChild(this._galleryVideo);
      this.stopListening();
      return this;
    }
  });

  return GalleryVideoView;
});
