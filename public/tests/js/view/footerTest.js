(function() {

	define([
		'jquery',
		'backbone',
		'hogan',
		'js/view/footerView'
	], function($, Backbone, Hogan, Footer) {
		return describe('Footer', function() {
	
			it('should display footer', function(done) {
				$('#main').empty().append(new Footer().render().$el);
				$('footer').should.exist;
				done();
			});
		
		});
	});
}).call(this);
