(function() {

	define([
		'jquery',
		'backbone',
		'hogan',
		'js/view/archiveView',
		'text!tests/fixtures/minis.json'
	], function($, Backbone, Hogan, ArchiveView, minis) {
		return describe('Archive View', function() {
			
			var  options = {date: '17002013'};
			var server;
			
			beforeEach(function (done) {
				server = sinon.fakeServer.create();

				server.respondWith('GET', /^.*minis.*$/, function(req) {
					return req.respond(200, {
						'Content-Type': 'application/json'
					}, minis);
				});
				
				return done();
			});

			afterEach(function () {
				return server.restore();
			});
			
			it.skip('should display one picture', function(done) {
				server.respond();
				$('#main').empty().append(new ArchiveView().render().$el);
				server.respond();
				$('.picture').attr('alt').should.be.equal('17002013.JPG');
				done();
			});
			
			it.skip('should have the right link', function(done) {
				server.respond();
				$('#main').empty().append(new ArchiveView().render().$el);
				$('.a').attr('href').should.be.equal('17002013');
				done();
			});
		
		});
	});
}).call(this);
