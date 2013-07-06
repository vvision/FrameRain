define([
  'jquery',
  'backbone',
  'hogan',
  'youtubePlayer',
  'text!templates/playVideo.html'
], function($, Backbone, Hogan, ytPlayer, PlayVideoTemplate) {

	return Backbone.View.extend({
		initialize: function (options) {
			if(options != null && options.id != undefined) {
				this.videoId = options.id;
			}
			
			this.playlist = options.playlist;
			console.log(this.playlist);
		},
			
		events: {
			
		},
		
		playNextVideo: function(context, player) {
			console.log("End of the video");
			//First video of the list finished to play, play the next one
			if(context.playlist.length != 0) {
				var video = context.playlist.shift();
				console.log("444");
				console.log(video);
				//$('.player').empty();
				//ytPlayer.playVideo($('.player', context.$el)[0], video.attributes.videoId, context, context.playNextVideo);
				player.loadVideoById(video.attributes.videoId);
			} else {
				return ;
			}
		},
		
		render: function () {
			this.$el.html(Hogan.compile(PlayVideoTemplate).render({
				//id: this.videoId
			}));
			
			if(this.playlist.length > 0) {
				var video = this.playlist.shift();
				console.log(video.attributes.videoId);
				ytPlayer.playVideo($('#player', this.$el)[0], video.attributes.videoId, this, this.playNextVideo);
			} else {
				ytPlayer.playVideo($('#player', this.$el)[0], this.videoId, this, function() {});
			}
			
			return this;
		}
	});

});
