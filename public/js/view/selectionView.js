define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/selectionList.html',
  'text!templates/selection.html',
    'text!templates/video.html'
], function($, Backbone, Hogan, SelectionListTemplate, SelectionTemplate, VideoTemplate) {

	return Backbone.View.extend({
		initialize: function (options) {
			this.displaySelection();
			if(options != null && options.id != undefined) {
				this.nameSelection = options.id;
			}
			this.videosSelection = [];
		},
			
		events: {
			'click .selection': 'displayVideos',
			'click img': 'playVideo',
			'click .playAll': 'playList'
		},
		
		playList: function() {
			$('.selectionList').empty();
			$('.selectionList').append('<iframe width="560" height="315" src="http://www.youtube.com/embed/?rel=0&autoplay=1&playlist=' + this.videoSelection.join(',') +'" frameborder="0" allowfullscreen></iframe>');
		},
		
		playVideo: function (e) {//TODO Create new view for the player
			var id = e.currentTarget.className;
			$('.selectionList').empty();
			$('.selectionList').append('<iframe width="560" height="315" src="http://www.youtube.com/embed/' + id + '?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
		},
		
		displayVideos: function(e) {
			var self = this;
			$('.selectionList').empty();//Clean all render
			$('.selectionList').append('<h4 class="playAll">Tout Voir</h4>');
			var idSelection = e.currentTarget.textContent;
			this.videoSelection = [];
			
			$.ajax({
					url: "/getselection",
					type: "GET",
					data: {
						idSelection: idSelection
					},
					success: function (data) {
						console.log(data);
						var dataString = data.toString();
						var arrayVideo = dataString.split(',');
						arrayVideo.forEach(function (element) {
console.log(element);
							var video = element.split('::');
							if(video[1] != undefined) {
							var link2Picture = 'img/' + video[1] + '.jpg';
							self.videoSelection.push(video[1]);
								$('.selectionList').append(Hogan.compile(VideoTemplate).render({
									site: video[0],
									id: video[1],
									title: video[2],
									pictureLink: link2Picture
								}));
							}
						});
					},
					error: function(err) {
					  console.log(err);
					}
			});
		},
		
		displaySelection: function () {
			$('.selectionList').empty();//Clean all render
			
			$.ajax({
					url: "/selections",
					type: "GET",
					success: function (data) {
						console.log(data);
						data.forEach(function (element) {
console.log(element);
							$('.selectionList').append(Hogan.compile(SelectionTemplate).render({
								name: element.toString()
							}));
						});
					},
					error: function(err) {
					  console.log(err);
					}
			});
		},
		
		render: function () {
			this.$el.html(Hogan.compile(SelectionListTemplate).render({

			}));
				
			return this;
		}
	});

});
