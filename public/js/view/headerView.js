define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/header.html',
  'i18n!nls/header'
], function($, Backbone, Hogan, HeaderTemplate, i18n) {


	return Backbone.View.extend({
		initialize: function () {
		},
			
		events: {
			'click .english': 'langEn',
			'click .french': 'langFr',
			'click .german': 'langDe'
		},
		
		//Maybe if localeStorage isn't available, use window. instead
		langEn: function () {
			localStorage.setItem('locale', 'en');
			location.reload();
		},
		
		langFr: function () {
			localStorage.setItem('locale', 'fr');
			location.reload();
		},
		
		langDe: function () {
			localStorage.setItem('locale', 'de');
			location.reload();
		},
	
		render: function () {
			this.$el.html(Hogan.compile(HeaderTemplate).render({
				main: "main",
				video: "video",
				selection: "seletion"
			}));
			
			return this;
		}
	});

});
