define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/main.html',
  'i18n!nls/picture'
], function($, Backbone, Hogan, MainTemplate, i18n) {


	return Backbone.View.extend({
			
		initialize: function (options) {
			
		},
			
		events: {
		},
	
		render: function () {
			this.$el.html(Hogan.compile(MainTemplate).render({
				title: "MAIN",
			}));
			return this;
		}
	});

});
