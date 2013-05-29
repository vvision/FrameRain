(function() {

	define([
		'jquery',
		'underscore',
		'sinon',
		'backbone',
		'hogan',
		'js/view/pictureView',
		'text!tests/fixtures/exif.json'
	], function($, _, sinon, Backbone, Hogan, PictureView, exifData) {
		return describe('Picture View', function() {
			var  options = {date: '17002013'};
			var server;
			
			beforeEach(function(done) {
				server = sinon.fakeServer.create();

				server.respondWith('GET', /^.*getExif.*$/, function(req) {
					return req.respond(200, {
						'Content-Type': 'application/json'
					}, exifData);
				});
				
				server.respondWith('GET', /^.*getType\/10102010$/, function(req) {
					return req.respond(404, {
						'Content-Type': 'application/text'
					}, null);
				});
				
				server.respondWith('GET', /^.*getType.*$/, function(req) {
					return req.respond(200, {
						'Content-Type': 'application/text'
					}, 'JPG');
				});
				
				return done();
			});

			afterEach(function() {
				return server.restore();
			});
	
			it('should display exif', function(done) {
				$('#main').empty().append(new PictureView().render().$el);
				server.respond();
				$('.exifData').should.exist;
				$('.camera').should.exist;
				$('.infos').should.exist;
				done();
			});
			
			it('should hide exif', function(done) {
				$('#main').empty().append(new PictureView().render().$el);
				server.respond();
				$('.exifData').should.exist;
				$('.hideExif').trigger("click");
				setTimeout(function () { 
					$('.exifData').css('display').should.be.equal('none');
					done();
				}, 800);
			});
			
			it('should display exif back', function(done) {
				$('#main').empty().append(new PictureView().render().$el);
				server.respond();
				$('.exifData').should.exist;
				$('.hideExif').trigger("click");	
				setTimeout(function () {
					$('.hideExif').trigger("click");
					setTimeout(function () {
						$('.exifData').css('display').should.be.equal('block');
						done();
					}, 100);
				}, 400);
			});
			
			it('should display default picture', function(done) {
				$('#main').empty().append(new PictureView({date: '10102010'}).render().$el);
				server.respond();
				$('.date').should.not.be.empty;
				$('.picture').should.exist;
				$('.picture').attr('src').should.be.equal('img/default.gif');
				done();
			});
			
			it('should display the given picture', function(done) {
				$('#main').empty().append(new PictureView(options).render().$el);
				server.respond();
				$('.date').should.not.be.empty;
				$('.picture').should.exist;
				$('.picture').attr('src').should.be.equal('img/2013/00/17002013.JPG');
				done();
			});
			
			it('should display the next picture', function(done) {
				$('#main').empty().append(new PictureView({date: '11002013'}).render().$el);
				server.respond();
				$('.date').should.not.be.empty;
				$('.picture').should.exist;
				$('.picture').attr('src').should.be.equal('img/2013/00/11002013.JPG');
				$('.right').trigger("click");
				server.respond();
				$('.date').should.not.be.empty;
				$('.picture').attr('src').should.be.equal('img/2013/00/12002013.JPG');
				done();
			});
			
			it('should display the previous picture', function(done) {
				$('#main').empty().append(new PictureView({date: '11002013'}).render().$el);
				server.respond();
				$('.date').should.not.be.empty;
				$('.picture').should.exist;
				$('.picture').attr('src').should.be.equal('img/2013/00/11002013.JPG');
				$('.left').trigger("click");
				server.respond();
				$('.date').should.not.be.empty;
				$('.picture').attr('src').should.be.equal('img/2013/00/10002013.JPG');
				done();
			});
			
			it('should not display tomorrow picture', function(done) {
				$('#main').empty().append(new PictureView().render().$el);
				server.respond();
				var date = $('.date').text();
				var src =$('.picture').attr('src');
				$('.date').should.not.be.empty;
				$('.picture').attr('src').should.not.be.empty;
				$('.right').trigger("click");
				server.respond();
				$('.date').text().should.be.equal(date);
				$('.picture').attr('src').should.be.equal(src);
				done();
			});
			
			it('should display a date', function(done) {
				$('#main').empty().append(new PictureView().render().$el);
				server.respond();
				$('.date').should.not.be.empty;
				done();
			});
		
		});
	});
}).call(this);
