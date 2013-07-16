requirejs.config({
  //baseUrl: '/',
  config: {
  	 i18n: {
  		locale: localStorage.getItem('locale') || 'en',
  	 }
  },
  paths: {
    'backbone': 'js/lib/backbone',
    'jquery': 'js/lib/jquery-1.8.2.min',
    'iframeTransport': 'js/lib/jquery.iframe-transport',
    'underscore': 'js/lib/underscore-1.4.3',
    'text': 'js/lib/text-2.0.3',
    'mocha': 'js/lib/mocha',
    'hogan': 'js/lib/hogan-3.0.0.amd',
    'i18n': 'i18n',
    'youtubePlayer': 'js/lib/youtubePlayer'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'jquery': {
    	exports: '$'
    },
    'iframeTransport': {
    	deps: ['jquery']
    },
    'youtubePlayer': {
    	deps: ['jquery']
    },
    'underscore': {
    	exports: '_'
    }
  }
});

define([
  'backbone',
  'js/view/headerView',
  'js/view/footerView',
  'js/view/videoView',
  'js/view/selectionView',
  'js/view/addView',
  'js/view/playVideo',
  'js/view/loginView',
  'js/view/integrationView'
], function(Backbone, HeaderView, FooterView, VideoView, SelectionView, AddView, PlayVideoView, LoginView, IntegrationView) {
	
		var Video = Backbone.Model.extend({
		defaults: {
            site: 0,
            videoId: null,
            title: null
        }
    });
  
  var VideoList = Backbone.Collection.extend({
  	model: Video		
  });
  
  var list = new VideoList();
   var playlist = new VideoList();

	var Router = Backbone.Router.extend({
		routes: {
			"": "video",
			"add": "add",
			"selection":	"selection",
			"play/:id": "playVideo",
			"play": "playVideo",
			"login": "login",
			"integration": "integration",
			":name": "video"
		},
	
		video: function (name) {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new VideoView({id: name, list: list, playlist: playlist}).render().el);
			$('#footer').html(new FooterView().render().el);
		},
		playVideo: function (id) {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new PlayVideoView({id: id, list: list, playlist: playlist}).render().el);
			$('#footer').html(new FooterView().render().el);
		},
		add: function () {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new AddView().render().el);
			$('#footer').html(new FooterView().render().el);
		},
		selection: function () {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new SelectionView().render().el);
			$('#footer').html(new FooterView().render().el);
		},
		integration: function () {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new IntegrationView().render().el);
			$('#footer').html(new FooterView().render().el);
		},
		login: function () {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new LoginView().render().el);
			$('#footer').html(new FooterView().render().el);
		}
	});
	
	window.router = new Router();
	
	Backbone.history.start({pushState: true});
	
	$('body').on('click', 'a', function(e){
		// If you have external links handle it here
		e.preventDefault();
		var $a = $(e.target).closest('a');
		var href = $a.attr('href');

		if(href === '#') return; // Escape the null link
		if(href.indexOf('http') != -1) return; // Escape external links
		if(href.indexOf('mailto') != -1) return; // Escape external links
		if( (href === 'conf' || href === 'add') && window.login && window.password && window.token) {
			return;
		} else {
			router.navigate(href, true);
		}
	});
});
