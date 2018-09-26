// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by js-graphs.js.
import { name as packageName } from "meteor/brunomarram:js-graphs";

// Write your tests here!
// Here is an example.
Tinytest.add('js-graphs - example', function (test) {
  test.equal(packageName, "js-graphs");
});
