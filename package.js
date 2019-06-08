Package.describe({
	name: 'zendy:segue',
	summary: 'Native-looking page transitions for Meteor mobile apps.',
	version: '1.1.2',
	git: 'https://github.com/zendylabs/segue-meteor-package.git'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2');
	api.use(['less', 'iron:router@1.0.12', 'percolate:momentum-iron-router@0.7.0', 'percolate:momentum@0.7.2', 'spacebars', 'templating'], 'client');
	api.use(['reactive-var']);
	api.addFiles('zendy-segue.js');
	api.addFiles('css/zendy-segue.css', 'client');
	api.export('Segue')
});

Package.onTest(function(api) {
	api.use('tinytest');
	api.use('zendy:segue');
});
