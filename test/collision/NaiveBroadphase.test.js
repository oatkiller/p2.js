var NaiveBroadphase = require(__dirname + '/../../src/collision/NaiveBroadphase');
var Broadphase = require(__dirname + '/../../src/collision/Broadphase');

describe('NaiveBroadphase', function () {
  it('can be constructed', function() {
    var broadphase = new NaiveBroadphase();
    expect(broadphase.type).toBe(Broadphase.NAIVE)
  })
})
