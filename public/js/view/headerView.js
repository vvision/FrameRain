define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/header.html'
], function($, Backbone, Hogan, HeaderTemplate) {


  return Backbone.View.extend({
    initialize: function () {
    },
      
    events: {
      'click .disconnect': 'logout',
      'click .hide': 'hidePlaylist'
    },
    
    hidePlaylist: function() {
     $('.playlistPosition') .fadeToggle('slow');
    },
    
    logout: function () {
      //Request to server to delete token   
      $.ajax({
        type: 'POST',
        url: '/logout',
        success: function (res, status, jqXHR) {
          
        },
        error: function (err) {
          console.error(err);
        }
      });
      sessionStorage.removeItem("login");
      sessionStorage.removeItem("password");

      $('.credential').empty();
      //Change CSS to hide links and infos
      $('.auth', this.el).css('visibility', 'hidden');
      $('.rm').css('visibility', 'hidden');
      $('.loginLink', this.el).css('visibility', 'visible');
      
      router.navigate('/', true);
    },
  
    render: function () {
      this.$el.html(Hogan.compile(HeaderTemplate).render({
        main: "main",
        video: "video"
      }));
      
      if(sessionStorage.getItem("login")) {
        $('.credential', this.el).text(sessionStorage.getItem("login"));
      }
      if(sessionStorage.getItem("login") && sessionStorage.getItem("password")) {
        //Change CSS to display links and infos
        $('.auth', this.el).css('visibility', 'visible');
        $('.loginLink', this.el).css('visibility', 'hidden');
      }
      
      return this;
    }
  });

});
