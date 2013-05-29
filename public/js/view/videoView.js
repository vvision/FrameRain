define([
  'jquery',
  'backbone',
  'hogan',
  'text!templates/videoList.html',
  'text!templates/video.html'
], function($, Backbone, Hogan, VideoListTemplate, VideoTemplate) {

	return Backbone.View.extend({
		initialize: function () {
		this.displayVideos();
			
		},
			
		events: {
			'click img': 'playVideo'
		},
		
		playVideo: function (e) {//TODO Create new view for the player
			var id = e.currentTarget.className;
			$('.videoList').empty();
			$('.videoList').append('<iframe width="560" height="315" src="http://www.youtube.com/embed/' + id + '?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
		},
		
		displayVideos: function () {
			$('.videoList').empty();//Clean all render
			
			$.ajax({
					url: "/listvideos",
					type: "GET",
					success: function (data) {
						console.log(data);
						var dataString = data.toString();
						var arrayVideo = dataString.split(',');
						arrayVideo.forEach(function (element) {
console.log(element);
							var video = element.split('::');
							if(video[1] != undefined) {
							var link2Picture = 'img/' + video[1] + '.jpg';
								$('.videoList').append(Hogan.compile(VideoTemplate).render({
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
		
		render: function () {
			this.$el.html(Hogan.compile(VideoListTemplate).render({

			}));
				
			return this;
		}
	});

});
