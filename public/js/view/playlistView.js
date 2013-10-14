define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/playlist.html',
  'text!templates/videoForPlaylist.html'
], function($, Backbone, Hogan, PlaylistTemplate, VideoForPlaylistTemplate) {

	return Backbone.View.extend({
	    className: "playlist",
		initialize: function (options) {
			
			this.playlist = options.playlist;
			console.log(this.playlist);
			
			this.firstDivDisplayed = 0;
			this.divWidth = $(window).width() - 103;
			this.divNumber = this.divWidth / 140;
			
			console.log(this.divWidth);
			console.log(this.divNumber);
			
			this.listenTo(this.playlist, 'add', this.renderNewVideo);
			this.listenTo(this.playlist, 'remove', this.removeFromView);
			this.listenTo(this.playlist, 'reset', this.resetPlaylistView);
		},
			
		events: {
			'click .playAll': 'playAll',
			'click .remove': 'removeFromCollection',
			'click .arrowRight': 'right',
			'click .arrowLeft': 'left'
		},
		
		playAll: function() {
		  if(this.playlist.length != 0) {
			router.navigate('play', true);
		  }
		},
		
		right: function() {
		  if(this.playlist.length > this.divNumber &&  this.firstDivDisplayed < this.playlist.length - 1) {
		    this.firstDivDisplayed++;
		    this.renderPlaylist(this.firstDivDisplayed, this.divNumber);
		  }
		},
		
		left: function() {
		  if(this.playlist.length > this.divNumber && this.firstDivDisplayed > 0) {
		    this.firstDivDisplayed--;
		    this.renderPlaylist(this.firstDivDisplayed, this.divNumber);
		  }
		},
		
		renderPlaylist: function(first, size) {
		  var self = this;
		  $('.playlistContent').empty(); 
		  if(this.playlist.length < this.divNumber) { 
		    //Render all
		    this.playlist.each(function(video) {
		        self.renderVideo(video)
		    });
		  } else {
		    var playlistDisplayed = this.playlist.slice(first, first + size);
		    console.log('SLICE');
		    console.log(playlistDisplayed);
		    playlistDisplayed.forEach(function(video) {
		        self.renderVideo(video)
		    });
		  }
		},
		
		renderVideo: function(last) {
			console.log(last);
              $('.playlistContent').append(Hogan.compile(VideoForPlaylistTemplate).render({
                site: last.attributes.site,
                id: last.attributes.videoId,
                title: last.attributes.title,
                pictureLink: 'img/' + last.attributes.videoId + '.jpg'
              }));
		},
		
		renderNewVideo: function(last) {
			if(this.playlist.length < this.divNumber) {
			  this.renderVideo(last);
           }
		},
		
		removeFromView: function(video) {
			$('.videoPlaylist .' + video.attributes.videoId).remove();
			console.log('Trying to remove');
			//Render playlist
			this.renderPlaylist(this.firstDivDisplayed, this.divNumber);
		},
		
		resetPlaylistView: function() {
			$('.playlist').empty();
		},
		
		removeFromCollection: function(e) {
			var className = e.currentTarget.className.split(' ');
			var id = className[0].trim();
			console.log(id);	
			var video = this.playlist.findWhere({videoId: id});
			this.playlist.remove(video);
			
		},
		
		render: function () {
			this.$el.html(Hogan.compile(PlaylistTemplate).render({
			}));
			return this;
		}
	});

});
