var Body = require(__dirname + "/../../src/objects/Body");
var Circle = require(__dirname + "/../../src/shapes/Circle");
var Box = require(__dirname + "/../../src/shapes/Box");
var World = require(__dirname + "/../../src/world/World");
var AABB = require(__dirname + "/../../src/collision/AABB");
var vec2 = require(__dirname + "/../../src/math/vec2");
var Plane = require(__dirname + "/../../src/shapes/Plane");

describe("Body", function() {
  let body;
  describe("when constructed as a static body", function() {
    beforeEach(function() {
      // Static via mass=0
      body = new Body({
        mass: 0
      });
    });
    it("should have an inverse mass of 0", function() {
      expect(body.invMass).toBe(0);
    });
    it("should have a type of 'static'", function() {
      expect(body.type).toBe(Body.STATIC);
    });
  });
  for (const [friendlyName, property, value, expectedValue] of [
    ["position", "position", [0, 1], vec2.fromValues(0, 1)],
    ["velocity", "velocity", [1, 2], vec2.fromValues(1, 2)],
    ["force", "force", [3, 4], vec2.fromValues(3, 4)],
    ["angular velocity", "angularVelocity", 5, 5],
    ["angular force", "angularForce", 5, 5],
    ["angle", "angle", Math.PI / 2, Math.PI / 2]
  ]) {
    describe(`when instantiated with a ${friendlyName} of ${JSON.stringify(
      value
    )}`, function() {
      beforeEach(function() {
        body = new Body({
          [property]: value
        });
      });
      it(`should have a ${friendlyName} of ${JSON.stringify(
        value
      )}`, function() {
        expect(body[property]).toEqual(expectedValue);
      });
    });
  }
  it("assigns a new ID to each instance", function() {
    expect(new Body().id).not.toEqual(new Body().id);
  });
  describe("when having a shape added to it", function() {
    let body, circle, world;
    beforeEach(function() {
      body = new Body();
      world = new World();
      circle = new Circle({ radius: 1 });
    });
    it("should have the added shape in its shapes array", function() {
      body.addShape(circle);
      expect(body.shapes).toEqual([circle]);
    });
    describe("when the lifecycle of a step is midway", function() {
      it("should throw", function() {
        world.addBody(body);
        return new Promise(function(resolve, reject) {
          try {
            world.on("postBroadphase", function() {
              expect(function() {
                body.addShape(new Circle());
              }).toThrow();
              resolve();
            });
            world.step(1);
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  });
});

module.exports = {
  adjustCenterOfMass: function(test) {
    var body = new Body();
    var shape = new Circle({ radius: 1 });
    body.addShape(shape, [1, 0], 0);
    body.adjustCenterOfMass();
    test.deepEqual(body.position, vec2.fromValues(1, 0));
    test.deepEqual(body.shapes[0].position, vec2.fromValues(0, 0));
    test.done();
  },

  applyDamping: function(test) {
    var body = new Body({
      mass: 1,
      velocity: [1, 0],
      angularVelocity: 1,
      damping: 0.5,
      angularDamping: 0.5
    });

    body.applyDamping(1);

    test.deepEqual(body.velocity, [0.5, 0]);
    test.deepEqual(body.angularVelocity, 0.5);

    test.done();
  },

  applyForce: {
    withPoint: function(test) {
      var body = new Body({ mass: 1, position: [2, 3] });
      var force = [0, 1];
      var point = [1, 0];

      body.applyForce(force, point);
      test.equal(body.force[0], 0);
      test.equal(body.force[1], 1);
      test.equal(body.angularForce, 1); // [1,0,0] cross [0,1,0] is [0,0,1]

      test.done();
    },
    withoutPoint: function(test) {
      var body = new Body({ mass: 1, position: [2, 3] });
      var force = [0, 1];

      body.applyForce(force);
      test.equal(body.force[0], 0);
      test.equal(body.force[1], 1);
      test.equal(body.angularForce, 0);

      test.done();
    }
  },

  applyForceLocal: {
    withPoint: function(test) {
      var bodyA = new Body({
        mass: 1,
        position: [2, 3],
        angle: Math.PI // rotated 180 degrees
      });
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyA.applyForceLocal([-1, 0], [0, 1]);
      test.ok(bodyA.angularForce > 0);
      test.ok(bodyA.force[0] > 0);
      test.ok(Math.abs(bodyA.force[1]) < 0.001);
      test.done();
    },
    withoutPoint: function(test) {
      var bodyA = new Body({
        mass: 1,
        position: [2, 3],
        angle: Math.PI // rotated 180 degrees
      });
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyA.applyForceLocal([-1, 0]);
      test.equal(bodyA.angularForce, 0);
      test.ok(bodyA.force[0] > 0);
      test.ok(Math.abs(bodyA.force[1]) < 0.001);
      test.done();
    }
  },

  applyImpulse: {
    withPoint: function(test) {
      var bodyA = new Body({ mass: 1, position: [2, 3] });
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyA.applyImpulse([-1, 0], [0, 1]);
      test.ok(bodyA.angularVelocity !== 0);
      test.ok(bodyA.velocity[0] !== 0);
      test.equal(bodyA.velocity[1], 0);
      test.done();
    },
    withoutPoint: function(test) {
      var bodyA = new Body({ mass: 1, position: [2, 3] });
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyA.applyImpulse([-1, 0]);
      test.equal(bodyA.angularVelocity, 0);
      test.ok(bodyA.velocity[0] !== 0);
      test.equal(bodyA.velocity[1], 0);
      test.done();
    }
  },

  applyImpulseLocal: {
    withPoint: function(test) {
      var bodyA = new Body({
        mass: 1,
        position: [2, 3],
        angle: Math.PI // rotated 180 degrees
      });
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyA.applyImpulseLocal([-1, 0], [0, 1]);
      test.ok(bodyA.angularVelocity > 0);
      test.ok(bodyA.velocity[0] > 0);
      test.ok(Math.abs(bodyA.velocity[1]) < 0.001);
      test.done();
    },
    withoutPoint: function(test) {
      var bodyA = new Body({
        mass: 1,
        position: [2, 3],
        angle: Math.PI // rotated 180 degrees
      });
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyA.applyImpulseLocal([-1, 0]);
      test.equal(bodyA.angularVelocity, 0);
      test.ok(bodyA.velocity[0] > 0);
      test.ok(Math.abs(bodyA.velocity[1]) < 0.001);
      test.done();
    }
  },

  fromPolygon: function(test) {
    var b = new Body();
    test.ok(b.fromPolygon([[-1, 1], [-1, 0], [1, 0], [1, 1], [0.5, 0.5]]));

    test.ok(b.shapes.length > 0);

    test.done();
  },

  overlaps: function(test) {
    var bodyA = new Body({ mass: 1 });
    var bodyB = new Body({ mass: 1 });
    bodyA.addShape(new Circle());
    bodyB.addShape(new Circle());
    var world = new World();
    world.addBody(bodyA);
    world.addBody(bodyB);
    world.step(1 / 60);
    test.ok(bodyA.overlaps(bodyB));
    test.done();
  },

  removeShape: {
    canRemove: function(test) {
      var body = new Body();
      body.addShape(new Circle({ radius: 1 }));
      test.ok(body.removeShape(body.shapes[0]));
      test.ok(!body.removeShape(new Circle({ radius: 1 })));
      test.equal(body.shapes.length, 0);
      test.done();
    },
    duringStep: function(test) {
      var world = new World();
      var body = new Body();
      var shape = new Circle();
      world.addBody(body);
      body.addShape(shape);
      world.on("postBroadphase", function() {
        test.throws(function() {
          body.removeShape(shape);
        }, "should throw on removing shapes during step");
        test.done();
      });
      world.step(1);
    }
  },

  getArea: function(test) {
    var body = new Body();
    body.addShape(new Box({ width: 1, height: 1 }));
    test.equal(body.getArea(), 1);
    test.done();
  },

  getAABB: function(test) {
    var body = new Body();
    body.addShape(new Box({ width: 1, height: 1 }));
    test.deepEqual(
      body.getAABB(),
      new AABB({ lowerBound: [-0.5, -0.5], upperBound: [0.5, 0.5] })
    );
    test.done();
  },

  setDensity: function(test) {
    var body = new Body({ mass: 1 });
    body.addShape(new Circle({ radius: 1 }));
    var inertiaBefore = body.inertia;
    body.setDensity(10);
    test.equal(body.mass, body.getArea() * 10);
    test.ok(inertiaBefore !== body.inertia);
    test.done();
  },

  setZeroForce: function(test) {
    var b = new Body({ force: [1, 2], angularForce: 3 });
    b.setZeroForce();
    test.equal(vec2.length(b.force), 0);
    test.equal(b.angularForce, 0);
    test.done();
  },

  sleep: function(test) {
    var b = new Body({ mass: 1 });
    test.equal(b.sleepState, Body.AWAKE);
    b.sleep();
    test.equal(b.sleepState, Body.SLEEPING);
    test.done();
  },

  toLocalFrame: function(test) {
    var b = new Body({ position: [1, 1] });
    var localPoint = [123, 456];
    b.toLocalFrame(localPoint, [1, 1]);
    test.deepEqual(localPoint, [0, 0]);
    test.done();
  },

  toWorldFrame: function(test) {
    var b = new Body({ position: [1, 1] });
    var worldPoint = [123, 456];
    b.toWorldFrame(worldPoint, [1, 1]);
    test.deepEqual(worldPoint, [2, 2]);
    test.done();
  },

  vectorToLocalFrame: function(test) {
    var b = new Body({ angle: Math.PI, position: [1, 1] });
    var v = [1, 0];
    b.vectorToLocalFrame(v, v);
    test.ok(vec2.distance(v, [-1, 0]) < 0.01);
    test.done();
  },

  vectorToWorldFrame: function(test) {
    var b = new Body({ angle: Math.PI, position: [1, 1] });
    var v = [1, 0];
    b.vectorToWorldFrame(v, v);
    test.ok(vec2.distance(v, [-1, 0]) < 0.01);
    test.done();
  },

  updateAABB: function(test) {
    var b = new Body();
    b.updateAABB();

    var b = new Body(),
      s = new Circle({ radius: 1 });
    b.addShape(s);
    b.updateAABB();

    test.equal(b.aabb.lowerBound[0], -1, "Lower AABB bound should be -1");
    test.equal(b.aabb.upperBound[0], 1, "Upper AABB bound should be 1");
    test.equal(b.aabb.lowerBound[1], -1, "Lower AABB bound should be -1");
    test.equal(b.aabb.upperBound[1], 1, "Upper AABB bound should be 1");

    var b = new Body(),
      s = new Circle({ radius: 1 }),
      offset = [-2, 3];
    b.addShape(s, offset, Math.PI / 2);
    b.updateAABB();

    test.equal(b.aabb.lowerBound[0], -s.radius + offset[0]);
    test.equal(b.aabb.upperBound[0], s.radius + offset[0]);
    test.equal(b.aabb.lowerBound[1], -s.radius + offset[1]);
    test.equal(b.aabb.upperBound[1], s.radius + offset[1]);

    test.done();
  },

  updateBoundingRadius: function(test) {
    var body = new Body({ mass: 1 });
    var shape = new Circle({ radius: 1 });
    body.addShape(shape);
    test.equal(body.boundingRadius, 1);
    shape.radius = 2;
    shape.updateBoundingRadius();
    body.updateBoundingRadius();
    test.equal(body.boundingRadius, 2);
    test.done();
  },

  updateMassProperties: function(test) {
    // STUB
    test.done();
  },

  wakeUp: function(test) {
    var b = new Body({ mass: 1 });
    b.sleep();
    test.equal(b.sleepState, Body.SLEEPING);
    b.wakeUp();
    test.equal(b.sleepState, Body.AWAKE);
    test.done();
  },

  integrate: {
    withoutCCD: function(test) {
      var body = new Body({
        velocity: [1, 0],
        mass: 1
      });
      var world = new World();
      world.addBody(body);
      body.integrate(1);
      test.deepEqual(body.position, vec2.fromValues(1, 0));
      test.done();
    },
    withCCD: function(test) {
      var body = new Body({
        velocity: [2, 0],
        position: [-1, 0],
        mass: 1,
        ccdSpeedThreshold: 0,
        shape: new Circle({ radius: 0.01 })
      });
      var world = new World();
      world.addBody(body);
      body.integrate(1);
      test.deepEqual(body.position, vec2.fromValues(1, 0));
      test.done();
    },
    withCCDAndObstacle: function(test) {
      var world = new World({ gravity: [0, 0] });
      var body = new Body({
        velocity: [2, 0],
        position: [-1, 0],
        mass: 1,
        ccdSpeedThreshold: 0,
        ccdIterations: 10
      });
      body.addShape(new Circle({ radius: 0.01 }));
      world.addBody(body);
      var planeBody = new Body({
        mass: 0,
        angle: Math.PI / 2
      });
      planeBody.addShape(new Plane());
      world.addBody(planeBody);
      world.step(1); // Need to use world.step() instead of body.integrate()
      test.ok(vec2.distance(body.position, [0, 0]) < 0.1);
      test.done();
    }
  },

  getVelocityAtPoint: function(test) {
    var body = new Body({
      mass: 1,
      velocity: [1, 0]
    });
    var velocity = [0, 0];
    body.getVelocityAtPoint(velocity, [0, 0]);
    test.deepEqual(velocity, [1, 0]);

    body.velocity[0] = 0;
    body.angularVelocity = 1;
    body.getVelocityAtPoint(velocity, [1, 0]);
    test.ok(Math.abs(velocity[0]) < 0.001);
    test.equal(velocity[1], 1); // r x w = 1 x 1 = 1

    test.done();
  },

  collisionResponse: function(test) {
    var bodyA = new Body({ mass: 1, position: [1, 0] });
    bodyA.addShape(new Circle({ radius: 1 }));

    var bodyB = new Body({ mass: 1, position: [-1, 0] });
    bodyB.addShape(new Circle({ radius: 1 }));

    var world = new World();
    world.addBody(bodyA);
    world.addBody(bodyB);

    world.step(1 / 60);
    test.ok(world.narrowphase.contactEquations[0].enabled);

    bodyA.collisionResponse = false;
    world.step(1 / 60);
    test.ok(!world.narrowphase.contactEquations[0].enabled);

    bodyA.collisionResponse = true;
    bodyA.shapes[0].collisionResponse = false;
    world.step(1 / 60);
    test.ok(!world.narrowphase.contactEquations[0].enabled);

    test.done();
  },

  index: function(test) {
    var bodyA = new Body();
    var bodyB = new Body();

    test.equal(bodyA.index, -1);
    test.equal(bodyB.index, -1);

    var world = new World();
    world.addBody(bodyA);
    world.addBody(bodyB);

    test.equal(bodyA.index, 0);
    test.equal(bodyB.index, 1);

    world.removeBody(bodyA);

    test.equal(bodyA.index, -1);
    test.equal(bodyB.index, 0);

    test.done();
  }
};
