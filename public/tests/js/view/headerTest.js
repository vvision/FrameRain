(function() {

	define([
		'jquery',
		'backbone',
		'hogan',
		'js/view/headerView'
	], function($, Backbone, Hogan, Header) {
		return describe('Header', function() {
	
			it('should display header', function(done) {
				$('#main').empty().append(new Header().render().$el);
				$('header').should.exist;
				done();
			});
		
		});
	});
}).call(this);
