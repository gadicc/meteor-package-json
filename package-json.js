var testMode = global._PACKAGE_JSON_TEST_MODE;

var nowatch =
  process.env.NODE_ENV === 'production'
  || process.argv.indexOf('test') !== -1
  || process.argv.indexOf('test-packages') !== -1;

var fs, path, _, PathWatcher, MFH;
if (testMode) {
  _ = require('underscore');
  MFH = { getAppPath: function() { return 'projRoot'; } };
  path = require('path');
} else {
  /* global Npm */
  fs = Npm.require('fs');
  path = Npm.require('path');
  _ = Npm.require('underscore');
  MFH = MeteorFilesHelpers;

  if (!nowatch) {
    try {
      // build plugin
      PathWatcher = Npm.require('pathwatcher');
    } catch (err) {
      // server package
      PathWatcher = Npm.require(path.join(
        MFH.getMeteorToolPath(),
        'dev_bundle', 'lib', 'node_modules', 'pathwatcher'
      ));
    }
  }
}

//if (process.env.APP_ID)
//  return;

var fetch = function() {
  return JSON.parse(fs.readFileSync(packageJsonPath));
};

var exit = function(message) {
  console.log(message);
  process.exit();
};

var projRoot = MFH.getAppPath();
var packageJsonPath = path.join(projRoot, 'package.json');

var packageJsonParsed;
if (!testMode) {
  try {
    packageJsonParsed = fetch();
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

var onFileChange = function() {
  var newlyParsed;
  try {
    newlyParsed = fetch();
  } catch (err) {
    console.log(err);
    // Don't exit.  Don't send changes until the file is valid.
    return;
  }

  var sectionFails = [];
  var name, oldConfig, newConfig;
  for (name in sectionChangeCallbacks) {
    oldConfig = packageJsonParsed[name];
    newConfig = newlyParsed[name];
    if (JSON.stringify(oldConfig) !== JSON.stringify(newConfig)
        && (sectionChangeCallbacks[name] === false ||
          !sectionChangeCallbacks[name]( oldConfig||{}, newConfig||{} ))) {
      sectionFails.push(name);
    }
  }

  if (sectionFails.length) {
    return exit("Your package.json was updated and changes to the "
      + "following sections could not be accepted: " + sectionFails.join(',')
      + "\n" + "Please restart Meteor");
  }

  packageJsonParsed = newlyParsed;
};

if (!testMode && !nowatch)
  PathWatcher.watch(packageJsonPath, _.debounce(onFileChange, 5));

var sectionChangeCallbacks = {};
var entireChangeCallbacks = {};

/* eslint no-undef: "off" */
packageJson = {

  getProjRoot: function() {
    return projRoot;
  },

  getPackageConfig: function(name, listener) {
    sectionChangeCallbacks[name] = listener || false;
    return packageJsonParsed[name] || {};
  },

  getEntireConfig: function(name, listener) {
    entireChangeCallbacks[name] = listener || false;
    return packageJsonParsed;
  }

};

if (testMode)
  packageJson._expose = function() {
    return {
      sectionChangeCallbacks: sectionChangeCallbacks,
      entireChangeCallbacks: entireChangeCallbacks,

      setInitial: function (obj) {
        packageJsonParsed = obj;
      },
      updateWith: function (obj) {
        fetch = function() { return obj };
        onFileChange();
      },
      setExit: function (func) {
        exit = func;
      }
    }
  };

if (typeof exports !== 'undefined')
  exports.packageJson = exports.default = packageJson;
