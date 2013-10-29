define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/integration.html'
], function($, Backbone, Hogan, IntegrationTemplate) {


  return Backbone.View.extend({
    className: 'integrationBox',
    initialize: function (options) {

    },
      
    events: {
      'click :button.userID': 'onClickUserID',
      'click .close' : 'showHideAlert'
    },
    
    showHideAlert: function() {
     $('.alert').fadeToggle('slow');
    },
    
    onClickUserID: function (e) {
      var self = this;
      e.preventDefault();
  
      //Display gif
      $('.msg').empty().append('<img src="img/loader.gif" alt="loading"/>');
      $.ajax({
        url: '/integrate',
        type: 'POST',       
        data: {
          site: $('#site').val(),
          userId: $(':text.user').val(),
          option: $('input:radio[name=option]:checked').val()
        },
        success: function (res, status, jqXHR) {
          $('.msg').empty().append(jqXHR.responseText);
          //Show alert if hidden.
          if($('.alert').css('display') == "none") {
            self.showHideAlert();
          }
          $(':text.user').val('');
        },
        error: function (err) {
          $('.msg').empty().append("Error.");
          //Show alert if hidden.
          if($('.alert').css('display') == "none") {
            self.showHideAlert();
          }
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
