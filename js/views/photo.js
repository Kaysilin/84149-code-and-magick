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

  return GalleryView;
});
