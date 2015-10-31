/* global Backbone: true */

'use strict';

define(function() {
  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  var ReviewModel = Backbone.Model.extend({
    /**
     * Установка дефолтного маркера оценки отзыва
     * @override
     */
    initialize: function() {
      this.set('rate-review', null);
      this._initialRating = this.get('review-rating');
    },

    /**
     * Положительная оценка отзыва
     * @override
     */
    useful: function() {
      this.set('rate-review', true);
      this.set('review-rating', this._initialRating + 1);
    },

    /**
     * Отрицательная оценка отзыва
     * @override
     */
    unuseful: function() {
      this.set('rate-review', false);
      this.set('review-rating', this._initialRating - 1);
    }
  });

  return ReviewModel;
});
