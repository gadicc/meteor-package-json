module.exports = function(wallaby) {
  return {
    files: [
      'package-json.js'
    ],

    tests: [
      'package-json-tests.js'
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    env: {
      type: 'node'
    }
  };
};