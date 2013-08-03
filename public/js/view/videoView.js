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
		  	
		  	$('#playlist').html(new PlaylistView({playlist: this.playlist}).render().el);
		  
		},
			
		events: {
			'click img': 'playVideo',
			'click .add': 'addToPlaylist',
			'click .playSelection': 'playSelection'
		},
		
		playVideo: function (e) {
			var id = e.currentTarget.className;
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
			console.log(this.list);
			var className = e.currentTarget.className.split(' ');
			var id = className[0].trim();
			console.log(id);
			var video = this.list.findWhere({videoId: id});
			console.log(video);
			this.playlist.add(video);
			console.log(this.playlist);
		},
		
		displayVideos: function (idSelection) {
		var self = this;
			$('.videoList').empty();//Clean all render
			
			if(idSelection == undefined) {
				$.ajax({
						url: "/listvideos",
						type: "GET",
						success: function (data) {
							console.log(data);
							var dataString = data.toString();
							var arrayVideo = dataString.split('\n');
							arrayVideo.forEach(function (element) {
	console.log(element);
								var video = element.split('::');
								if(video[1] != undefined) {
								var link2Picture = 'img/' + video[1] + '.jpg';
								self.list.add({site: video[0], videoId: video[1], title: video[2]});//TODO: Site contains \n BAD!
								//console.log(self.list.get("5dbEhBKGOtY"));
									$('.videoList').append(Hogan.compile(VideoTemplate).render({
										site: video[0],
										id: video[1],
										title: video[2],
										pictureLink: link2Picture
									}));
								}
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
							var dataString = data.toString();
							var arrayVideo = dataString.split('\n');								
							$('.videoList').append('<h4 class="playSelection">Tout Voir</h4>');
							arrayVideo.forEach(function (element) {
	console.log(element);
								var video = element.split('::');
								if(video[1] != undefined) {
								var link2Picture = 'img/' + video[1] + '.jpg';

								self.videoSelection.push(video[1]);//Hum, it seems it's the same thing as below
								self.list.add({site: video[0], videoId: video[1], title: video[2]});//TODO: Site contains \n BAD!
								$('.videoList').append(Hogan.compile(VideoTemplate).render({
									site: video[0],
									id: video[1],
									title: video[2],
									pictureLink: link2Picture
								}));
							}
						});
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
		
		render: function () {
			this.$el.html(Hogan.compile(VideoListTemplate).render({

			}));
			
			
			return this;
		}
	});

});
