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
			'click button.validation': 'tryAuth',
			'click .close' : 'showHideAlert'
		},

		showHideAlert: function() {
		 $('.alert').fadeToggle('slow');
		},
		
		tryAuth: function (e) {
		  var self = this;
		  
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
              sessionStorage.setItem('login', $('.login').val());
              sessionStorage.setItem('password', $('.password').val());
              console.log(data);
              $('.credential').text(sessionStorage.getItem("login"));
              //Change CSS to display links and infos (show we are logged in)
              $('.auth').css('visibility', 'visible');
              $('.loginLink', this.el).css('visibility', 'hidden');
              //Change view
              router.navigate('/', true);
            },
            error: function(err) {
              $('.msg').empty().append('Incorrect login or password.');
              //Show alert if hidden.
              if($('.alert').css('display') == "none") {
                self.showHideAlert();
              }
              $('.password').val('');
            }
          });
		},
		
		render: function () {
			this.$el.html(Hogan.compile(LoginTemplate).render({
				username: 'Username',
				password: 'Password',
				log: 'Log in'
			}));
			return this;
		}
	});

});
