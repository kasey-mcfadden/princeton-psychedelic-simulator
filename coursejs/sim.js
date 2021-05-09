var Sim = Sim || {};

var randomPoints;
var triangle;
var ngon;
var prev_point;
var backwards = false;
var first = true;
var prev_vert_index;
const MAX_ITERATIONS = 10000;
const ppi = 100; // points per iteration


Sim.init = function() {
  // Points by which cloth will be suspended in "Random" pinning mode.
  randomPoints = [];

  // triangle = new Triangle(SceneParams.sideLength);
  ngon = new Ngon(SceneParams.nverts, SceneParams.sideLength);
  // ngon = new Ngon(SceneParams.sideLength, SceneParams.nverts);
  // cloth = new Cloth(SceneParams.xSegs, SceneParams.ySegs, SceneParams.fabricLength);

  Sim.update();
}

// Performs one timestep of the simulation.
// This function is repeatedly called in a loop, and its results are
// then rendered to the screen.
// For more info, see animate() in render.js.
Sim.simulate = function() {
  // If toggled, update sphere position for interactive fun
  // if (SceneParams.movingSphere && Scene.sphere.mesh.visible) {
  //   Sim.updateSpherePosition(Scene.sphere);
  // }
  // console.log(triangle.getRandomPoint());

  // // Apply all relevant forces to the cloth's particles
  // cloth.applyForces();

  // // For each particle, perform Verlet integration to compute its new position
  // cloth.update(SceneParams.TIMESTEP);

  // // Handle collisions with other objects in the scene
  // cloth.handleCollisions();

  // // Handle self-intersections
  // if (SceneParams.avoidClothSelfIntersection) {
  //   cloth.handleSelfIntersections();
  // }

  // Apply cloth constraints
  // cloth.enforceConstraints();
  // triangle.fractal();
  // Pin constraints
  // Sim.enforcePinConstraints();

  if (SceneParams.fade && Scene.scene.children.length > MAX_ITERATIONS) {
    backwards = true;
  }
  if (Scene.scene.children.length == 0) {
    backwards = false;
  }
  if (!SceneParams.pause && Scene.scene.children.length < MAX_ITERATIONS + 2 * ppi) {
    Sim.chaos();
  }
}



Sim.chaos = function() {
    // SceneParams.number of points or something
    // pick a point at random
    // let point = triangle.getRandomPoint();

    for (let i = 0; i < ppi; i++) {

      if (backwards == false) { // fade in
        let point = ngon.getRandomPoint();
        let index = ngon.getRandomVertexIndex(SceneParams.restrict, prev_vert_index);

        if (prev_point === undefined || prev_vert_index === undefined) {
          prev_point = point;
          prev_vert_index = index;
          return;
        }

        let v = ngon.vertices[index].clone();
  
        // get the next point (some fraction r of the distance between it and a polygon vertex picked at random)
        let next = new THREE.Vector3().subVectors(v, prev_point);
        next.multiplyScalar(SceneParams.r);
    
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(next);
        var dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );
        var dot = new THREE.Points( dotGeometry, dotMaterial );
        Scene.scene.add(dot);

        prev_point = next;
        prev_vert_index = index

      } else if (Scene.scene.children.length > 0){ // fade out
        Scene.scene.remove(Scene.scene.children[0]);
      }
    }
    
    //   // for testing: place a dot at each vertex
    // for (let v of ngon.geometry.vertices) {
    //   var dotGeometry = new THREE.Geometry();
    //   dotGeometry.vertices.push(v);
    //   var dotMaterial = new THREE.PointsMaterial( { size: 10, sizeAttenuation: false } );
    //   var dot = new THREE.Points( dotGeometry, dotMaterial );
    //   Scene.scene.add(dot);
    // }

        // draw the next point some fraction r of the distance between it and a polygon vertex picked at random
        // (throw out the first few points)
};


Sim.restartNgon = function() {
  // remove old triangle outline
  // Scene.scene.remove(Scene.triangle.mesh);

  // remove old verts out
  while(Scene.scene.children.length > 0) {
    Scene.scene.remove(Scene.scene.children[0]); 
  }

  // recreate the triangle data structure
  ngon = new Ngon(SceneParams.nverts, SceneParams.sideLength);
  // triangle = new Triangle(sideLength);

  Scene.ngon.vertices = ngon.vertices;
  // Scene.triangle.mesh = new THREE.Mesh(triangle.geometry, new THREE.MeshNormalMaterial());
  // update the scene geometry
  // triangle.mesh = new THREE.Mesh(triangle.geometry, new THREE.MeshNormalMaterial());
  // Scene.triangle.mesh.position.set(0, 0, 0);
  // Scene.triangle.mesh.castShadow = true;
  // Scene.scene.add(Scene.triangle.mesh); // adds the cloth to the scene
}

// Update the scene to reflect changes made in the GUI.
Sim.update = function() {
  // Sim.placeObject(SceneParams.object);
  // Sim.pinCloth(SceneParams.pinned);
}

Sim.placeObject = function(object) {
  // if (object == "Sphere" || object == "sphere") {
  //   Scene.sphere.mesh.visible = true;
  //   Scene.box.mesh.visible = false;
  //   Sim.restartCloth();
  // } else if (object == "Box" || object == "box") {
  //   Scene.sphere.mesh.visible = false;
  //   Scene.box.mesh.visible = true;
  //   Sim.restartCloth();
  // } else if (object == "None" || object == "none") {
  //   Scene.sphere.mesh.visible = false;
  //   Scene.box.mesh.visible = false;
  // }
}

Sim.updateSpherePosition = function(sphere) {
  // sphere.prevPosition.copy(sphere.position);
  // sphere.position.y = 50 * Math.sin(time / 600);
  // sphere.position.x = 50 * Math.sin(time / 600);
  // sphere.position.z = 50 * Math.cos(time / 600);
}
