var Broadphase = require(__dirname + '/../../src/collision/Broadphase');

describe('Broadphase', function() {
  it('can be constructed with the NAIVE flag', function() {
    expect(new Broadphase(Broadphase.NAIVE).type).toEqual(Broadphase.NAIVE)
  })
})
