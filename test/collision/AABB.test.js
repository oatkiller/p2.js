var AABB = require(__dirname + '/../../src/collision/AABB');
var Ray = require(__dirname + '/../../src/collision/Ray');
var vec2 = require(__dirname + '/../../src/math/vec2');

describe('AABB', function() {
  it('can be constructed', function() {
    var aabb = new AABB({
        lowerBound: [-1, -2],
        upperBound: [1, 2]
    });
    expect(aabb.lowerBound[0]).toBe(-1);
    expect(aabb.lowerBound[1]).toBe(-2);
    expect(aabb.upperBound[0]).toBe(1);
    expect(aabb.upperBound[1]).toBe(2);
  })
  it('can be copied', function() {
    var aabb = new AABB({
        lowerBound: [-1, -2],
        upperBound: [1, 2]
    });
    var aabb2 = new AABB();
    aabb2.copy(aabb);
    expect(aabb2.lowerBound[0]).toBe(-1);
    expect(aabb2.lowerBound[1]).toBe(-2);
    expect(aabb2.upperBound[0]).toBe(1);
    expect(aabb2.upperBound[1]).toBe(2);
  })
  describe('when detecting overlaps', function() {
    let a, b
    beforeEach(function() {
      a = new AABB()
      b = new AABB()
      vec2.set(a.lowerBound, -1, -1);
      vec2.set(a.upperBound,  1,  1);
      vec2.set(b.lowerBound, -1, -1);
      vec2.set(b.upperBound,  1,  1);
    })
    it('should detect overlap with an identical AABB', function() {
      expect(a.overlaps(b)).toBe(true)
    })
    it('should detect overlaps on its corner', function() {
      vec2.set(b.lowerBound,  1,  1);
      vec2.set(b.upperBound,  2,  2);
      expect(a.overlaps(b)).toBe(true)
    })
    it('should detect separated AABBs', function() {
      vec2.set(b.upperBound,  2,  2);
      vec2.set(b.lowerBound,  1.1,  1.1);
      expect(a.overlaps(b)).toBe(false)
    })
    it('should detect when another AABB is fully inside of it', function() {
      vec2.set(b.lowerBound, -0.5, -0.5);
      vec2.set(b.upperBound,  0.5,  0.5);
      expect(a.overlaps(b)).toBe(true)
    })
    it('should detect when it is fully inside another AABB', function() {
      vec2.set(b.lowerBound, -1.5, -1.5);
      vec2.set(b.upperBound,  1.5,  1.5);
      expect(a.overlaps(b)).toBe(true)
    })
    it('should detect that an AABB that is adjacent but not touching does not overlap', function() {
      vec2.set(b.lowerBound, -3, -0.5);
      vec2.set(b.upperBound, -2,  0.5);
      expect(a.overlaps(b)).toBe(false)
    })
  })
  describe('when checking if a point is contained within', function() {
    let aabb
    beforeEach(function() {
      aabb = new AABB({
        lowerBound: [-1, -1],
        upperBound: [1, 1]
      });
    })
    it('should detect that a point inside is contained', function () {
      expect(aabb.containsPoint([0,0])).toBe(true);
    })
    it('should detect that points along the edge of the AABB are contained', function () {
      expect(aabb.containsPoint([1,1])).toBe(true);
      expect(aabb.containsPoint([-1,-1])).toBe(true);
    })
    it('should detect that a point outside isn\'t contained', function() {
      expect(aabb.containsPoint([2,2])).toBe(false);
    })
  })
  describe('when checking if it overlaps a ray that does overlap', function() {
    let aabb, ray
    beforeEach(function() {
      aabb = new AABB({
        upperBound: [1, 1],
        lowerBound: [-1, -1]
      });
      ray = new Ray({
        from: [-2, 0],
        to: [0, 0]
      });
    })
    it('should return a number between 0 and 1', function() {
      const result = aabb.overlapsRay(ray)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(1)
    })
  })
  it('can be set from points', function () {
    const a = new AABB()
    a.setFromPoints([
      [-1, -1],
      [1, 1]
    ])
    expect(a.lowerBound).toEqual(vec2.fromValues(-1, -1))
    expect(a.upperBound).toEqual(vec2.fromValues(1, 1))
  })
  it('can be set from points and then translated', function() {
    const a = new AABB()
    a.setFromPoints(
      [
        [40, 50],
        [-20, -30],
      ],
      [ 100, 200]
    )
    expect(a.lowerBound).toEqual(vec2.fromValues(80, 170))
    expect(a.upperBound).toEqual(vec2.fromValues(140, 250))
  })
  it('can be set from points which will be rotated first', function() {
    const a = new AABB()
    a.setFromPoints(
      [
        [1, 0],
        [-1, 0],
      ],
      [0, 0],
      Math.PI / 4
    )
    expect(a.lowerBound[0]).toBeCloseTo(-Math.cos(Math.PI / 4))
    expect(a.lowerBound[1]).toBeCloseTo(-Math.sin(Math.PI / 4))
    expect(a.upperBound[0]).toBeCloseTo(Math.cos(Math.PI / 4))
    expect(a.upperBound[1]).toBeCloseTo(Math.sin(Math.PI / 4))
  })
})
