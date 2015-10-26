/* global Backbone: true */

'use strict';

define(function() {
  /**
   * @constructor
   * @extends {Backbone.View}
   * @global
   */
  var GalleryVideoView = Backbone.View.extend({
    tagName: 'video',

    /**
       * Отрисовка видео из галереи
       * @override
       */
    render: function() {
      var newVideo = document.createElement('video');
      newVideo.src = this.model.get('url');
      newVideo.autoplay = true;
      newVideo.controls = true;
      newVideo.loop = true;
      newVideo.poster = this.model.get('preview');
      console.log(this.el);
      this.el.appendChild(newVideo);
    }
  });

  return GalleryVideoView;
});
