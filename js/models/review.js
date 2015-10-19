/* global Backbone: true */

'use strict';

(function() {
  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  var ReviewModel = Backbone.Model.extend({
    initialize: function() {
      this.set('rate-review', null);
    },

    useful: function(inc) {
      inc = inc ? inc : 1;
      this.set('rate-review', 'yes');
      this.set('review-rating', this['review-rating'] + inc);
    },

    unuseful: function(dec) {
      dec = dec ? dec : 1;
      this.set('rate-review', 'no');
      this.set('review-rating', this['review-rating'] - dec);
    }
  });

  window.ReviewModel = ReviewModel;
})();
