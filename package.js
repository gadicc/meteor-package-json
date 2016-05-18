/* globals Package */

Package.describe({
  name: 'gadicc:package-json',
  version: '1.0.4',
  summary: 'Get/watch package.json for package authors',
  git: 'https://github.com/gadicc/meteor-package-json',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('sanjo:meteor-files-helpers@1.2.0_1');
  api.use('modules');
  api.addFiles('package-json.js', 'server');
  api.export('packageJson');
});

/*
Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('practicalmeteor:mocha@2.4.5_2');
  api.use('gadicc:package-json');
  api.mainModule('package-json-tests.js', 'server');
});
*/