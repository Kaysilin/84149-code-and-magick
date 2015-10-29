/* global Backbone: true */

'use strict';

define([
  'models/review'
], function(ReviewModel) {
  /**
   * @constructor
   * @param {Object} attributes
   * @param {Object} options
   * @extends {Backbone.Collection}
   */
  var ReviewsCollection = Backbone.Collection.extend({
    model: ReviewModel,
    url: 'data/reviews.json'
  });

  return ReviewsCollection;
});
