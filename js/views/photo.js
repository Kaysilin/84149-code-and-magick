/* global Backbone: true */

'use strict';

(function() {
  /**
   * @constructor
   * @extends {Backbone.View}
   * @global
   */
  var GalleryView = Backbone.View.extend({
    /**
     * Тег, использующийся для элемента представления.
     * @type {string}
     * @override
     */
    tagName: 'div',

    /**
     * Отрисовка фото из галереи
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

  window.GalleryView = GalleryView;
})();
