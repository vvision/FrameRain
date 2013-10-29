define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/add.html'
], function($, Backbone, Hogan, AddTemplate) {


  return Backbone.View.extend({
    className: 'addBox',
    initialize: function () {
      
    },
      
    events: {
      'click :button.videoUrl': 'onClickVideo',
      'click :button.selectionName': 'onClickSelection',
      'click .close' : 'showHideAlert'
    },
    
    showHideAlert: function() {
     $('.alert').fadeToggle('slow');
    },
    
    onClickVideo: function (e) {
      var self = this;
      e.preventDefault();
      var params = $(':text.url').serializeArray(); 

      //Display gif
      $('.msg').empty().append('Loading');
      $.ajax({
        url: '/add',
        type: 'POST',       
        data: params,
        success: function (res, status) {
          $('.msg').empty().append("Video saved!");
          //Show alert if hidden.
                    if($('.alert').css('display') == "none") {
                      self.showHideAlert();
                    }
          $(':text.url').val('');
        },
        error: function (err) {
          console.log(err);
        }
      });
    },
    
    onClickSelection: function () {
      var self = this;
    },
  
    render: function () {
      this.$el.html(Hogan.compile(AddTemplate).render({
        add: 'Add',
        url: 'Url',
      }));

      return this;
    }
  });

});
