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
      console.log('useful ' + this.attributes['review-rating']);
      this.set('review-rating', this.attributes['review-rating'] + inc);
      console.log('useful+1 ' + this.attributes['review-rating']);
    },

    unuseful: function(dec) {
      dec = dec ? dec : 1;
      this.set('rate-review', 'no');
      console.log('unuseful ' + this.attributes['review-rating']);
      this.set('review-rating', this.attributes['review-rating'] - dec);
      console.log('useful-1 ' + this.attributes['review-rating']);
    }
  });

  window.ReviewModel = ReviewModel;
})();
