/* global Backbone: true */

'use strict';

define(function() {
  /**
   * @constructor
   * @extends {Backbone.Model}
   * @global
   */
  var ReviewModel = Backbone.Model.extend({
    /**
     * Установка дефолтного маркера оценки отзыва
     * @override
     */
    initialize: function() {
      this.set('rate-review', null);
    },

    /**
     * Положительная оценка отзыва
     * @override
     */
    useful: function(inc) {
      this.set('rate-review', 'yes');
      this.set('review-rating', this.attributes['review-rating'] + inc);
    },

    /**
     * Отрицательная оценка отзыва
     * @override
     */
    unuseful: function(dec) {
      this.set('rate-review', 'no');
      this.set('review-rating', this.attributes['review-rating'] - dec);
    }
  });

  return ReviewModel;
});
