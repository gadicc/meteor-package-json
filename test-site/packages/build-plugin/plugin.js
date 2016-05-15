//import packageJson from 'meteor/gadicc:package-json';

Plugin.registerCompiler({
  filenames: ['compiler-test'],
}, function () {

  var Compiler = function() {};

  Compiler.prototype.processFilesForTarget = function(files) {
    console.log('plugin.js', packageJson.getProjRoot());
  };

  Compiler.prototype.setDiskCacheDirectory = function() {};

  return new Compiler();
});
