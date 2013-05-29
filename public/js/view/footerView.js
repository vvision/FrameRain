define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/footer.html',
  'i18n!nls/footer'
], function($, Backbone, Hogan, FooterTemplate, i18n) {


	return Backbone.View.extend({
		initialize: function () {
		
		},
			
		events: {
		},
	
		render: function () {
			this.$el.html(Hogan.compile(FooterTemplate).render({
				text: i18n.text
			}));
			return this;
		}
	});

});
