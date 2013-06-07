requirejs.config({
  //baseUrl: '/',
  config: {
  	 i18n: {
  		locale: localStorage.getItem('locale') || 'en',
  	 }
  },
  paths: {
    'backbone': 'js/lib/backbone-0.9.2',
    'jquery': 'js/lib/jquery-1.8.2.min',
    'iframeTransport': 'js/lib/jquery.iframe-transport',
    'underscore': 'js/lib/underscore-1.4.3',
    'text': 'js/lib/text-2.0.3',
    'mocha': 'js/lib/mocha',
    'hogan': 'js/lib/hogan-3.0.0.amd',
    'i18n': 'i18n'
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
    'underscore': {
    	exports: '_'
    }
  }
});

define([
  'backbone',
  'js/view/headerView',
  'js/view/footerView',
  'js/view/mainView',
  'js/view/videoView',
  'js/view/selectionView',
  'js/view/addView'
], function(Backbone, HeaderView, FooterView, MainView, VideoView, SelectionView, AddView) {

	var Router = Backbone.Router.extend({
		routes: {
			"":						"video",
			"add":			"add",
			"selection":	"selection",
			"selection/:id": "selection"
		},
	
		video: function () {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new VideoView().render().el);
			$('#footer').html(new FooterView().render().el);
		},
		add: function () {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new AddView().render().el);
			$('#footer').html(new FooterView().render().el);
		},
		selection: function (id) {
			$('#header').html(new HeaderView().render().el);
			$('#main').html(new SelectionView({id: id}).render().el);
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
