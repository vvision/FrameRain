(function() {

  requirejs.config({
    baseUrl: '/',
	paths: {
		'backbone': 'js/lib/backbone-0.9.2',
		'jquery': 'js/lib/jquery-1.8.2.min',
		'chai': 'js/lib/chai-1.4.0',
      	'chai-jquery': 'js/lib/chai-jquery',
      	'chai-sinon': 'js/lib/sinon-chai',
      	'sinon': 'js/lib/sinon-1.5.2',
		'datePicker': 'js/lib/jquery-ui-1.9.2.datepicker',
		'iframeTransport': 'js/lib/jquery.iframe-transport',
		'underscore': 'js/lib/underscore-1.4.3',
		'text': 'js/lib/text-2.0.3',
		'mocha': 'js/lib/mocha',
		'hogan': 'js/lib/hogan-3.0.0.amd',
		'datepicker-fr': 'js/lib/datepicker-i18n/jquery.ui.datepicker-fr'
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'chai': {
			exports: 'chai'
		},
		'chai-jquery': {
			deps: ['chai'],
			exorts: 'chaiJquery'
		},
		'chai-sinon': {
			deps: ['chai'],
			exports: 'sinonChai'
		},
		'sinon': {
			exports: 'sinon'
		},
		'jquery': {
			exports: '$'
		},
		 'mocha': {
		     exports: 'mocha'
        },
		'datePicker': {
			deps: ['jquery']
		},
		'iframeTransport': {
			deps: ['jquery']
		},
		'underscore': {
			exports: '_'
		}
   }
});

  window.app = {};

  define(['require', 'jquery', 'chai', 'chai-sinon', 'chai-jquery', 'mocha'], function(require, $, chai, chaiSinon, chaiJQuery, mocha) {
    var _ref;
    window.assert = chai.assert;
    window.should = chai.should();
    window.expect = chai.expect;
    chai.use(chaiJQuery);
    chai.use(chaiSinon);
    if (-1 !== ((_ref = window.location.search) != null ? _ref.indexOf('debug') : void 0)) {
      $('body').addClass('debug');
    }
    mocha.setup({
      ui: 'bdd',
      globals: 'console'
    }, 'window', 'app');
    return require([
      'tests/js/view/addTest',
      'tests/js/view/aboutTest',
      'tests/js/view/archiveTest',
      'tests/js/view/pictureTest',
      'tests/js/view/confTest',
      'tests/js/view/footerTest',
      'tests/js/view/headerTest',
      'tests/js/view/loginTest'
    ], function() {
      return mocha.run();
    });

  });

}).call(this);
