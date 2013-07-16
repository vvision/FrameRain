define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/integration.html'
], function($, Backbone, Hogan, IntegrationTemplate) {


	return Backbone.View.extend({
			
		initialize: function (options) {

		},
			
		events: {
			'click :button.userID': 'onClickUserID',
		},
		
		onClickUserID: function () {
			var self = this;

			//Display gif
			$('.msg').empty().append('<img src="img/loader.gif" alt="loading"/>');
			$.ajax({
				url: '/integrate',
				type: 'POST',				
				data: {
					site: 1,
					userId: $(':text.user').val(),
					option: 0
				},
				success: function (res, status, jqXHR) {
					$('.msg').empty().append(jqXHR.responseText);
					$(':text.user').val('');
				},
				error: function (err) {
					console.log(err);
				}
			});
		},
		
		render: function () {
			this.$el.html(Hogan.compile(IntegrationTemplate).render({
			}));
			return this;
		}
	});

});
