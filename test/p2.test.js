var p2 = require('../src/p2');
var pkg = require('../package.json');

test('package version and source version should match', function() {
  expect(pkg.version).toBe(p2.version)
});
