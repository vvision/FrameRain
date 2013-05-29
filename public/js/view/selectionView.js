define([
  'jquery',
  'backbone',
  'hogan',

  'text!templates/selectionList.html'
], function($, Backbone, Hogan, SelectionListTemplate) {

	return Backbone.View.extend({
		initialize: function () {
		

		},
			
		events: {
		},
		

		
		render: function () {
			this.$el.html(Hogan.compile(SelectionListTemplate).render({

			}));
				
			return this;
		}
	});

});
