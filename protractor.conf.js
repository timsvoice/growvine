// An example configuration file.
exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',

  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:3000/#!/',

  // Framework to use. Jasmine 2 is recommended.
  framework: 'jasmine2',

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
