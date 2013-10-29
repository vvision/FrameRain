define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/videoList.html',
  'text!templates/video.html',
  'js/view/playlistView',
], function($, Backbone, Hogan, VideoListTemplate, VideoTemplate, PlaylistView) {

  return Backbone.View.extend({
    initialize: function (options) {
      if(options != null && options.id != undefined) {
      console.log("TRUE");
        this.nameSelection = options.id;
        this.videoSelection = [];
        this.displayVideos(this.nameSelection);
      } else {
        this.displayVideos();
      }
      
        this.list = options.list;
        this.playlist = options.playlist;
    },
      
    events: {
      'click .picture': 'playVideo',
      'click .add': 'addToPlaylist',
      'click .playSelection': 'playSelection',
      'click .rm': 'removeVideo'
    },
    
    playVideo: function (e) {
      var className = e.currentTarget.className.split(' ');
      var id = className[0].trim();
      router.navigate('play/' + id, true);
    },
    
    playSelection: function() {
      this.playlist.reset();
      while(this.list.length > 0) {
        this.playlist.add(this.list.shift());
      }
      router.navigate('play', true);
    },
    
    addToPlaylist: function(e) {
      var className = e.currentTarget.className.split(' ');
      var id = className[0].trim();
      var video = this.list.findWhere({videoId: id});
      this.playlist.add(video);
    },
    
    displayVideos: function (idSelection) {
    var self = this;
      $('.videoList').empty();//Clean all
      
      if(idSelection == undefined) {
        $.ajax({
          url: "/listvideos",
          type: "GET",
          success: function (data) {
            console.log(data);
            data.forEach(function (el) {
              var link2Picture = 'img/' + el.videoId+ '.jpg';
              self.list.add({site: el.site, videoId: el.videoId, title: el.title});
              $('.videoList').append(Hogan.compile(VideoTemplate).render({
                site: el.site,
                id: el.videoId,
                title: el.title,
                pictureLink: link2Picture
              }));
            });
            self.displayRemoveOption();
          },
          error: function(err) {
            console.log(err);
          }
        });
      } else {
        this.videoSelection = [];
        $.ajax({
          url: "/getselection",
          type: "GET",
          data: {
            idSelection: idSelection
          },
          success: function (data) {
            console.log(data);
            displayRemoveOption();
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    },
    
    displayRemoveOption: function() {
      if(sessionStorage.getItem("login") && sessionStorage.getItem("password")) {
        //Change CSS to display links and infos
        $('.rm', this.el).css('visibility', 'visible');
      } else {
        $('.rm', this.el).css('visibility', 'hidden');
      }
    },
    
    removeVideo: function(e) {
      var className = e.currentTarget.className.split(' ');
      var id = className[0].trim();
      
      $.ajax({
        url: "/remove",
        type: "GET",
        data: {
          video: id
        },
        success: function (data) {
          //Remove video from the view
          $('.' + id + '').remove();  
        },
        error: function(err) {
          console.log(err);
        }
      });
    
    },
    
    render: function () {
      this.$el.html(Hogan.compile(VideoListTemplate).render({

      }));
      return this;
    }
  });

});
