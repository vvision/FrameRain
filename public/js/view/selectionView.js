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
		},
			
		events: {
			'click .selection': 'displayVideos',
		},
		
		displayVideos: function(e) {
			var idSelection = e.currentTarget.textContent;
			router.navigate(idSelection, true);
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
