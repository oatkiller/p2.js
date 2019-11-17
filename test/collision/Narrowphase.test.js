var Narrowphase = require(__dirname + "/../../src/collision/Narrowphase"),
  Convex = require(__dirname + "/../../src/shapes/Convex"),
  Circle = require(__dirname + "/../../src/shapes/Circle"),
  Body = require(__dirname + "/../../src/objects/Body"),
  Box = require(__dirname + "/../../src/shapes/Box"),
  Capsule = require(__dirname + "/../../src/shapes/Capsule"),
  Plane = require(__dirname + "/../../src/shapes/Plane"),
  Particle = require(__dirname + "/../../src/shapes/Particle"),
  Line = require(__dirname + "/../../src/shapes/Line"),
  ContactEquation = require(__dirname + "/../../src/equations/ContactEquation"),
  FrictionEquation = require(__dirname +
    "/../../src/equations/FrictionEquation"),
  ContactMaterial = require(__dirname + "/../../src/material/ContactMaterial"),
  Material = require(__dirname + "/../../src/material/Material"),
  vec2 = require(__dirname + "/../../src/math/vec2");

describe("Narrowphase", function() {
  let rect,
    circle,
    convex,
    capsule,
    plane,
    line,
    particle,
    narrowphase,
    bodyA,
    bodyB,
    position,
    angle;

  beforeEach(function() {
    position = [0, 0];
    angle = 0;

    // Rect
    rect = new Box();

    // Circle
    const verts = [];
    const N = 50;
    for (var i = 0; i < N; i++) {
      verts.push(
        vec2.fromValues(
          Math.cos(((2 * Math.PI) / N) * i),
          Math.sin(((2 * Math.PI) / N) * i)
        )
      );
    }
    circle = new Circle({ radius: 1 });
    convex = new Convex({ vertices: verts });
    capsule = new Capsule({ length: 1, radius: 1 });
    plane = new Plane();
    particle = new Particle();
    line = new Line();

    narrowphase = new Narrowphase();
    narrowphase.currentContactMaterial = new ContactMaterial(
      new Material(),
      new Material()
    );

    bodyA = new Body();
    bodyB = new Body();
  });

  it("can be constructed", function() {
    const instance = new Narrowphase();
    expect(instance).toEqual(expect.any(Narrowphase));
  });

  describe("when checking if two capsules collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.capsuleCapsule(
          bodyA,
          capsule,
          position,
          angle,
          bodyB,
          capsule,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`12`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.capsuleCapsule(
            bodyA,
            capsule,
            position,
            angle,
            bodyB,
            capsule,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a plane and a capsule collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.planeCapsule(
          bodyA,
          plane,
          position,
          angle,
          bodyB,
          capsule,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`2`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.planeCapsule(
            bodyA,
            plane,
            position,
            angle,
            bodyB,
            capsule,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`2`);
      });
    });
  });

  describe("when checking if a circle and a capsule collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.circleCapsule(
          bodyA,
          circle,
          position,
          angle,
          bodyB,
          capsule,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.circleCapsule(
            bodyA,
            circle,
            position,
            angle,
            bodyB,
            capsule,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if two circles collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.circleCircle(
          bodyA,
          circle,
          position,
          angle,
          bodyB,
          circle,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.circleCircle(
            bodyA,
            circle,
            position,
            angle,
            bodyB,
            circle,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a circle and a convex body collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.circleConvex(
          bodyA,
          circle,
          position,
          angle,
          bodyB,
          convex,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.circleConvex(
            bodyA,
            circle,
            position,
            angle,
            bodyB,
            convex,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a circle and a line collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.circleLine(
          bodyA,
          circle,
          position,
          angle,
          bodyB,
          line,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.circleLine(
            bodyA,
            circle,
            position,
            angle,
            bodyB,
            line,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a circle and a particle collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.circleParticle(
          bodyA,
          circle,
          position,
          angle,
          bodyB,
          particle,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.circleParticle(
            bodyA,
            circle,
            position,
            angle,
            bodyB,
            particle,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a circle and a plane collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.circlePlane(
          bodyA,
          circle,
          position,
          angle,
          bodyB,
          plane,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.circlePlane(
            bodyA,
            circle,
            position,
            angle,
            bodyB,
            plane,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if two bodies collided last step", function() {
    it("returns a boolean", function() {
      expect(narrowphase.collidedLastStep(bodyA, bodyB)).toMatchInlineSnapshot(
        `false`
      );
    });
  });

  describe("when checking if a convex and a capsule collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.convexCapsule(
          bodyA,
          convex,
          position,
          angle,
          bodyB,
          capsule,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`4`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.convexCapsule(
            bodyA,
            convex,
            position,
            angle,
            bodyB,
            capsule,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if two convex bodies collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.convexConvex(
          bodyA,
          convex,
          position,
          angle,
          bodyB,
          convex,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`2`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.convexConvex(
            bodyA,
            convex,
            position,
            angle,
            bodyB,
            convex,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a convex body and a line collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.convexLine(
          bodyA,
          convex,
          position,
          angle,
          bodyB,
          line,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`0`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.convexLine(
            bodyA,
            convex,
            position,
            angle,
            bodyB,
            line,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`0`);
      });
    });
  });

  describe("when checking if a plane and convex body collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.planeConvex(
          bodyA,
          plane,
          position,
          angle,
          bodyB,
          convex,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`26`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.planeConvex(
            bodyA,
            plane,
            position,
            angle,
            bodyB,
            convex,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  it("can create a contact equation", function() {
    expect(
      narrowphase.createContactEquation(bodyA, bodyB, plane, rect)
    ).toBeInstanceOf(ContactEquation);
  });

  it("can create a friction equation", function() {
    expect(
      narrowphase.createFrictionEquation(bodyA, bodyB, plane, rect)
    ).toBeInstanceOf(FrictionEquation);
  });

  describe("when checking if a line and a capsule collapse", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.lineCapsule(
          bodyA,
          line,
          position,
          angle,
          bodyB,
          capsule,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`0`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.lineCapsule(
            bodyA,
            line,
            position,
            angle,
            bodyB,
            capsule,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`0`);
      });
    });
  });

  describe("when checking if a line collides with another line", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.lineLine(
          bodyA,
          line,
          position,
          angle,
          bodyB,
          line,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`0`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.lineLine(
            bodyA,
            line,
            position,
            angle,
            bodyB,
            line,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`0`);
      });
    });
  });

  describe("when checking if a line and a box collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.lineBox(
          bodyA,
          line,
          position,
          angle,
          bodyB,
          rect,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`0`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.lineBox(
            bodyA,
            line,
            position,
            angle,
            bodyB,
            rect,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`0`);
      });
    });
  });

  describe("when checking if a particle and convex body collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.particleConvex(
          bodyA,
          particle,
          position,
          angle,
          bodyB,
          convex,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.particleConvex(
            bodyA,
            particle,
            position,
            angle,
            bodyB,
            convex,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a particle and a plane collide", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.particlePlane(
          bodyA,
          particle,
          position,
          angle,
          bodyB,
          plane,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`1`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.particlePlane(
            bodyA,
            particle,
            position,
            angle,
            bodyB,
            plane,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`1`);
      });
    });
  });

  describe("when checking if a plane collides with a line", function() {
    it("returns the number of contact points", function() {
      expect(
        narrowphase.planeLine(
          bodyA,
          plane,
          position,
          angle,
          bodyB,
          line,
          position,
          angle
        )
      ).toMatchInlineSnapshot(`0`);
    });
    describe("when only testing for collision", function() {
      it("returns 0 or 1", function() {
        expect(
          narrowphase.planeLine(
            bodyA,
            plane,
            position,
            angle,
            bodyB,
            line,
            position,
            angle,
            true
          )
        ).toMatchInlineSnapshot(`0`);
      });
    });
  });

  describe('when it has a contact equation', function() {
    let contact
    beforeEach(function() {
      contact = narrowphase.createContactEquation(bodyA, bodyB, plane, rect)
      narrowphase.contactEquations.push(contact);
    })
    describe('when it has been reset', function() {
      beforeEach(function() {
        narrowphase.reset();
      })
      it('should have no contact equations and no friction equations', function() {
        expect(narrowphase.contactEquations).toHaveLength(0)
        expect(narrowphase.frictionEquations).toHaveLength(0)
      })
    })
  });

  describe('when checking if bodies overlap', function() {
    it('determines if overlapping bodies overlap', function() {
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyB.addShape(new Circle({ radius: 1 }));
      expect(narrowphase.bodiesOverlap(bodyA, bodyB)).toBe(true);
    })

    it('determines when bodies don\'t overlap', function() {
      bodyA.addShape(new Circle({ radius: 1 }));
      bodyB.addShape(new Circle({ radius: 1 }));
      bodyB.position[0] = 10;
      expect(narrowphase.bodiesOverlap(bodyA, bodyB)).toBe(false);
    })

    it('determines when colliding bodies with collision groups and collision masks collide', function() {
      bodyA.addShape(new Circle({ radius: 1, collisionGroup: 1, collisionMask: 1 }));
      bodyB.addShape(new Circle({ radius: 1, collisionGroup: 2, collisionMask: 2 }));
      bodyB.shapes[0].collisionGroup = bodyB.shapes[0].collisionMask = 1;
      expect(narrowphase.bodiesOverlap(bodyA, bodyB, true)).toBe(true)
    })

    it('determines when non-colliding bodies with collision groups and collision masks don\'t collide', function() {
      bodyA.addShape(new Circle({ radius: 1, collisionGroup: 1, collisionMask: 1 }));
      bodyB.addShape(new Circle({ radius: 1, collisionGroup: 2, collisionMask: 2 }));
      expect(narrowphase.bodiesOverlap(bodyA, bodyB, true)).toBe(undefined)
    })

    it("determines when bodies collide regardless of order", function() {
      bodyA.addShape(new Box({ width: 1, height: 1 }));
      bodyB.addShape(new Circle({ radius: 1 }));

      expect(narrowphase.bodiesOverlap(bodyA, bodyB, true)).toBe(true)
      expect(narrowphase.bodiesOverlap(bodyB, bodyA, true)).toBe(true);
    })
  })
});
