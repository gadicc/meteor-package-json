// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by normal.js.
import { name as packageName } from "meteor/normal";

// Write your tests here!
// Here is an example.
Tinytest.add('normal - example', function (test) {
  test.equal(packageName, "normal");
});
