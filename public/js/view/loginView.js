define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/login.html'
], function($, Backbone, Hogan, LoginTemplate) {


	return Backbone.View.extend({
		className: 'loginBox',
		initialize: function (options) {

		},
			
		events: {
			'click button.validation': 'tryAuth' 
		},
		
		tryAuth: function (e) {
		    e.preventDefault();
			console.log('click');
			$.ajax({
				url: '/auth' ,
				type: 'POST',
				data: {
					login: $('.login').val(),
					password: $('.password').val()
				},
				success: function (data) {
					//TODO Store token (and login + password?) in a global area.
					//window.token = data;
					//window.login = $('.login').val();
					//window.password = $('.password').val();
					//OK, let's another thing
					//localStorage.setItem('token', data);
					//localStorage.setItem('login', $('.login').val());
					//localStorage.setItem('password', $('.password').val());
					sessionStorage.setItem('login', $('.login').val());
					sessionStorage.setItem('password', $('.password').val());
					console.log(data);
					$('.credential').text(sessionStorage.getItem("login"));
					//Change CSS to display links and infos (do it one to show we are logged in)
					$('.auth').css('visibility', 'visible');
					$('.loginLink', this.el).css('visibility', 'hidden');
					//Change view to show login is complete
					router.navigate('/', true);
				},
				error: function(err) {
					console.log(err);
				}
			});
		},
		
		render: function () {
			this.$el.html(Hogan.compile(LoginTemplate).render({
				login: 'login',
				password: 'password',
				connect: 'connect'
			}));
			return this;
		}
	});

});
