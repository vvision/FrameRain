define([
  'jquery',
  'backbone',
  'hogan',
  //'iframeTransport',
  'text!templates/add.html'
], function($, Backbone, Hogan, /*iframeTransport,*/ AddTemplate) {


	return Backbone.View.extend({
	    className: 'addBox',
		initialize: function () {
		},
			
		events: {
			'click :button.videoUrl': 'onClickVideo',
			'click :button.selectionName': 'onClickSelection'
		},
		
		onClickVideo: function (e) {
			var self = this;
			e.preventDefault();
console.log($(':text.url').serializeArray());//////////////////////////////////////////////////////////
			var params = $(':text.url').serializeArray();	
			//params.push({name: "login", value: sessionStorage.getItem("login")});
			//params.push({name: "password", value: sessionStorage.getItem("password")});
			//params.push({name: "token", value: sessionStorage.getItem("token")});

			//Display gif
			$('.msg').empty().append('<img src="img/loader.gif" alt="loading"/>');
			$.ajax({
				url: '/add',
				type: 'POST',				
				data: params,
				//iframe: true,
				//processData: false,
				success: function (res, status, jqXHR) {
					$('.msg').empty().append(jqXHR.responseText);
					$(':text.url').val('');
				},
				error: function (err) {
					console.log(err);
				}
			});
		},
		
		onClickSelection: function () {
			var self = this;
			
console.log($(':text.selectionName').serializeArray());//////////////////////////////////////////////////////////
			var params = $(':text.selectionName').serializeArray();	
			//params.push({name: "login", value: sessionStorage.getItem("login")});
			//params.push({name: "password", value: sessionStorage.getItem("password")});
			//params.push({name: "token", value: sessionStorage.getItem("token")});

			//Display gif
			$('.msg').empty().append('<img src="img/loader.gif" alt="loading"/>');
			$.ajax({
				url: '/createselection',
				type: 'POST',				
				data: params,
				//iframe: true,
				//processData: false,
				success: function (res, status, jqXHR) {
					$('.msg').empty().append(jqXHR.responseText);
					$(':text.selectionName').val('');
				},
				error: function (err) {
					console.log(err);
				}
			});
		},
	
		render: function () {
			this.$el.html(Hogan.compile(AddTemplate).render({
				add: 'ADD',
				url: 'Url',
				send: 'Send',
				urlSample: 'Ex: http://www.youtube.com/watch?v=aHjpOzsQ9YI'
			}));

			return this;
		}
	});

});
