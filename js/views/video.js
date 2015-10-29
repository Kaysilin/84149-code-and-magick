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
      var galleryVideo = document.createElement('video');
      galleryVideo.src = this.model.get('url');
      galleryVideo.autoplay = true;
      galleryVideo.loop = true;
      galleryVideo.poster = this.model.get('preview');
      console.log(this.el);
      this.el.appendChild(galleryVideo);
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
    }
  });

  return GalleryVideoView;
});
