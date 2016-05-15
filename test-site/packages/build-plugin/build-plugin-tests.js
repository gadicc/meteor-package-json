// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by build-plugin.js.
import { name as packageName } from "meteor/build-plugin";

// Write your tests here!
// Here is an example.
Tinytest.add('build-plugin - example', function (test) {
  test.equal(packageName, "build-plugin");
});
