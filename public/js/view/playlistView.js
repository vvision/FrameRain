define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/playlist.html',
  'text!templates/videoForPlaylist.html'
], function($, Backbone, Hogan, PlaylistTemplate, VideoForPlaylistTemplate) {

	return Backbone.View.extend({
		initialize: function (options) {
			
			this.playlist = options.playlist;
			console.log(this.playlist);
			
			this.listenTo(this.playlist, 'add', this.renderNewVideo);
			this.listenTo(this.playlist, 'remove', this.removeFromView);
			this.listenTo(this.playlist, 'reset', this.resetPlaylistView);
		},
			
		events: {
			'click .playAll': 'playAll',
			'click .remove': 'removeFromCollection'
		},
		
		playAll: function() {
			router.navigate('play', true);
			//$('.selectionList').empty();
			//$('.selectionList').append('<iframe width="560" height="315" src="http://www.youtube.com/embed/?rel=0&autoplay=1&playlist=' + this.videoSelection.join(',') +'" frameborder="0" allowfullscreen></iframe>');
		},
		
		renderNewVideo: function(last) {
			console.log(last);
			$('.playlist').append(Hogan.compile(VideoForPlaylistTemplate).render({
				site: last.attributes.site,
				id: last.attributes.videoId,
				title: last.attributes.title,
				pictureLink: 'img/' + last.attributes.videoId + '.jpg'
			}));
		},
		
		removeFromView: function(video) {
			$('.videoPlaylist .' + video.attributes.videoId).remove();
			console.log('Trying to remove');
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
