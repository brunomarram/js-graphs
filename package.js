Npm.depends({
    lodash: "4.17.11"
});

Package.describe({
    name: "brunomarram:js-graphs",
    version: "0.0.1",
    // Brief, one-line summary of the package.
    summary: "",
    // URL to the Git repository containing the source code for this package.
    git: "https://github.com/brunomarram/js-graphs",
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: "README.md"
});

Package.onUse(function(api) {
    api.versionsFrom("1.7.0.5");
    api.use("ecmascript");
    api.mainModule("js-graphs.js");
});

Package.onTest(function(api) {
    api.use("ecmascript");
    api.use("tinytest");
    api.use("brunomarram:js-graphs");
    api.mainModule("js-graphs-tests.js");
});
