"use strict";

// Particle constructor
function Particle(x, y, z, mass) {
  this.position = new THREE.Vector3(); // position
  this.previous = new THREE.Vector3(); // previous
  this.original = new THREE.Vector3(); // original
  initParameterizedPosition(x, y, this.position);
  initParameterizedPosition(x, y, this.previous);
  initParameterizedPosition(x, y, this.original);

  this.netForce = new THREE.Vector3(); // net force acting on particle
  this.mass = mass; // mass of the particle
  this.correction = new THREE.Vector3(); // offset to apply to enforce constraints
}

// Snap a particle back to its original position
Particle.prototype.lockToOriginal = function() {
  this.position.copy(this.original);
  this.previous.copy(this.original);
};

// Snap a particle back to its previous position
Particle.prototype.lock = function() {
  this.position.copy(this.previous);
  this.previous.copy(this.previous);
};

// Add the given force to a particle's total netForce.
// Params:
// * force: THREE.Vector3 - the force to add
Particle.prototype.addForce = function(force) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 1 lines of code.
  this.netForce.add(force);
  // ----------- STUDENT CODE END ------------
};

// Perform Verlet integration on this particle with the provided
// timestep deltaT.
// Params:
// * deltaT: Number - the length of time dt over which to integrate
Particle.prototype.integrate = function(deltaT) {
  const DAMPING = SceneParams.DAMPING;

  // ----------- STUDENT CODE BEGIN ------------
  // You need to:
  // (1) Save the old (i.e. current) position into this.previous.
  // (2) Compute the new position of this particle using Verlet integration,
  //     and store it into this.position.
  // (3) Reset the net force acting on the particle (i.e. make it (0, 0, 0) again).
  // ----------- Our reference solution uses 13 lines of code.

  // (1)
  let current = new THREE.Vector3().copy(this.position);

  // (2)
  let x_t = new THREE.Vector3().copy(this.position);
  let v_t_dt = new THREE.Vector3().copy(this.position).sub(this.previous);
  let a_t = new THREE.Vector3().copy(this.netForce).divideScalar(this.mass);
  this.position = x_t.add(v_t_dt.multiplyScalar(1 - DAMPING)).add(a_t.multiplyScalar(Math.pow(deltaT, 2)));

  // (3)
  this.previous = current;
  this.netForce = new THREE.Vector3(0, 0, 0);

  // ----------- STUDENT CODE END ------------
};

// Handle collisions between this Particle and the provided floor.
// Note: the fields of floor are documented for completeness, but you
//       *WILL NOT* need to use all of them.
// Params:
// * floor: An object representing the floor of the scene, with properties:
//    - mesh: THREE.Mesh - the physical representation in the scene
//    - geometry: THREE.PlaneBufferGeometry - the abstract geometric representation
//    - material: THREE.MeshPhongMaterial - material information for lighting
Particle.prototype.handleFloorCollision = function(floor) {
  let floorMesh = floor.mesh;
  let floorPosition = floorMesh.position;
  const EPS = 3;
  // ----------- STUDENT CODE BEGIN ------------
  // Handle collision of this particle with the floor.
  // ----------- Our reference solution uses 4 lines of code.
  const GROUND = floorPosition.y;
  if (this.position.y < GROUND + EPS) {
    this.position.y = GROUND + EPS;
  }
  // ----------- STUDENT CODE END ------------
};

// Handle collisions between this Particle and the provided sphere.
// Note: the fields of sphere are documented for completeness, but you
//       *WILL NOT* need to use all of them.
// Params:
// * sphere: An object representing a sphere in the scene, with properties:
//    - mesh: THREE.Mesh - the physical representation in the scene
//    - geometry: THREE.SphereGeometry - the abstract geometric representation
//    - material: THREE.MeshPhongMaterial - material information for lighting
//    - radius: number - the radius of the sphere
//    - position: THREE.Vector3 - the sphere's position in this frame
//    - prevPosition: THREE.Vector3 - the sphere's position in the previous frame
Particle.prototype.handleSphereCollision = function(sphere) {
  if (sphere.mesh.visible) {
    const friction = SceneParams.friction;
    let spherePosition = sphere.position.clone();
    let prevSpherePosition = sphere.prevPosition.clone();
    let EPS = 5; // empirically determined
    
    // ----------- STUDENT CODE BEGIN ------------
    // Handle collision of this particle with the sphere.
    // As with the floor, use EPS to prevent clipping.
    let posFriction = new THREE.Vector3();
    let posNoFriction = new THREE.Vector3();
    // ----------- Our reference solution uses 28 lines of code.

    // First check if the particle is inside the sphere at all. If not, return and 
    // do nothing.
    let projection = new THREE.Vector3().subVectors(this.position, spherePosition);
    if (projection.length() > sphere.radius + EPS) {
      return;
    } 

    // If so, compute a position posNoFriction, which is the projection of the 
    // particle’s current position to the nearest point on the sphere’s surface.

    let offset = projection.clone().normalize().multiplyScalar(sphere.radius + EPS);
    posNoFriction = spherePosition.clone().add(offset);

    // If the particle was outside of the sphere in the last time-step, then take 
    // corrective action while accounting for friction: 
      // To do so, compute a position posFriction, which is the particle’s previous 
      // position, adjusted by the sphere’s movement in the last time-step. If the 
      // sphere is not moving, then this adjustment should be zero. Let the 
      // particle’s new position be the weighted sum of posFriction and 
      // posNoFriction, weighted by friction and 1.0 - friction, respectively.
    let prevDist = this.previous.distanceTo(prevSpherePosition);

    if (prevDist > sphere.radius + EPS) {
      posFriction.add(this.previous.clone()).add(spherePosition.clone().sub(prevSpherePosition));

      posFriction.multiplyScalar(friction);
      posNoFriction.multiplyScalar(1 - friction);
    }
    // If the particle was instead inside of the sphere in the last time-step, 
    // project it back onto the surface of the sphere directly at posNoFriction. 
    // (You do not have to account for friction in this case.)

    this.position = new THREE.Vector3().addVectors(posFriction, posNoFriction);

    // ----------- STUDENT CODE END ------------
  }
};

// Handle collisions between this Particle and the provided axis-aligned box.
// Note: the fields of box are documented for completeness, but you
//       *WILL NOT* need to use all of them.
// Params:
// * box: An object representing an axis-aligned box in the scene, with properties:
//    - mesh: THREE.Mesh - the physical representation in the scene
//    - geometry: THREE.BoxGeometry - the abstract geometric representation
//    - material: THREE.MeshPhongMaterial - material information for lighting
//    - boundingBox: THREE.Box3 - the bounding box of the box in the scene
Particle.prototype.handleBoxCollision = function(box) {
  if (box.mesh.visible) {
    const friction = SceneParams.friction;
    let boundingBox = box.boundingBox.clone();
    const EPS = 10; // empirically determined
    // ----------- STUDENT CODE BEGIN ------------
    // Handle collision of this particle with the axis-aligned box.
    // As before, use EPS to prevent clipping
    let posFriction = new THREE.Vector3();
    let posNoFriction = new THREE.Vector3();
    // ----------- Our reference solution uses 66 lines of code.

    // check bounds
    if (!boundingBox.containsPoint(this.position)) {
      return;
    }

    let min_diff = new THREE.Vector3().subVectors(this.position, boundingBox.min);
    let max_diff = new THREE.Vector3().subVectors(boundingBox.max, this.position);
    let min = Math.min(min_diff.x, min_diff.y, min_diff.z, max_diff.x, max_diff.y, max_diff.z);
    posNoFriction = this.position.clone();

    if (min == min_diff.x) {
      posNoFriction.x = boundingBox.min.x - EPS;
    } else if (min == max_diff.x) {
      posNoFriction.x = boundingBox.max.x + EPS;
    } else if (min == min_diff.y) {
      posNoFriction.y = boundingBox.min.y - EPS;
    } else if (min == max_diff.y) {
      posNoFriction.y = boundingBox.max.y + EPS;
    } else if (min == min_diff.z) {
      posNoFriction.z = boundingBox.min.z - EPS;
    } else if (min == max_diff.z) {
      posNoFriction.z = boundingBox.max.z + EPS;
    } 
    
    if (!boundingBox.containsPoint(this.previous)) {
      posFriction = this.previous.clone();
      posFriction.multiplyScalar(friction);
      posNoFriction.multiplyScalar(1.0 - friction);
    }

    this.position = new THREE.Vector3().addVectors(posFriction, posNoFriction);
    // ----------- STUDENT CODE END ------------
  }
};

// ------------------------ Don't worry about this ---------------------------
// Apply the cached correction vector to this particle's position, and
// then zero out the correction vector.
// Particle.prototype.applyCorrection = function() {
//   this.position.add(this.correction);
//   this.correction.set(0,0,0);
// }
