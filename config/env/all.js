'use strict';

module.exports = {
	app: {
		title: 'Verdantree',
		description: 'Supercharged sales for wholesale nurseries',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/foundation-apps/dist/css/foundation-apps.css',
				'public/lib/foundation-apps/dist/css/foundation-apps-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-event/dist/event.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-ui-indeterminate/dist/indeterminate.js',
				'public/lib/angular-ui-mask/dist/mask.js',
				'public/lib/angular-ui-scroll/dist/ui-scroll.js',
				'public/lib/angular-ui-scrollpoint/dist/scrollpoint.js',
				'public/lib/angular-ui-uploader/dist/uploader.js',
				'public/lib/angular-ui-validate/dist/validate.js',
				'public/lib/angular-ui-utils/index.js',
				'public/lib/angular-ui-grid/ui-grid.js',
				'public/lib/api-check/dist/api-check.js',
				'public/lib/angular-formly/dist/formly.js',
				'public/lib/underscore/underscore.js',
				'public/lib/tether/tether.min.js',
				'public/lib/momentjs/min/moment.min.js',
				'public/lib/angular-momentjs/angular-momentjs.min.js',
				'public/lib/foundation-apps/js/angular/**/*.js',
				'public/lib/foundation-apps/dist/js/foundation-apps.js',
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*[!spec].js',
			'public/dist/application.min.css'
		]
	}
};