var Sim = Sim || {};

var randomPoints;
var triangle;
var ngon;
var prev_point;
var backwards = false;
var first = true;
var prev_vert_index;
var MAX_ITERATIONS = SceneParams.iterations;
var ppi = 100; // points per iteration
var x_offset = 0;
var y_offset = 0;
// var points = [];
// var spun = false;

Sim.init = function() {
  ngon = new Ngon(SceneParams.nverts, SceneParams.sideLength, x_offset, y_offset);
  Sim.update();
}

// Performs one timestep of the simulation.
// This function is repeatedly called in a loop, and its results are
// then rendered to the screen.
// For more info, see animate() in render.js.
Sim.simulate = function() {
  if (!SceneParams.pause) {
    if (Scene.scene.children.length < MAX_ITERATIONS + 1.5 * ppi) {
      if (Scene.scene.children.length == 0) {
        backwards = false;
      } else if (SceneParams.fade && Scene.scene.children.length >= MAX_ITERATIONS) {
        backwards = true;
      }
      Sim.chaos();
    }
  }
}


Sim.chaos = function() {
  for (let i = 0; i < ppi; i++) {
    // if (!SceneParams.fade) {

    // }
    if (backwards == false) { // fade in
      let point = ngon.getRandomPoint();
      let index = ngon.getRandomVertexIndex(SceneParams.restrict, prev_vert_index);

      if (prev_point === undefined || prev_vert_index === undefined) {
        prev_point = point;
        prev_vert_index = index;
        return;
      }
      // console.log(prev_vert_index, index);

      let v = ngon.vertices[index].clone();

      // get the next point (some fraction r of the distance between it and a polygon vertex picked at random)
      let next = new THREE.Vector3().subVectors(v, prev_point);
      next.multiplyScalar(SceneParams.r);
  
      var dotGeometry = new THREE.Geometry();
      dotGeometry.vertices.push(next);
      var dotMaterial = new THREE.PointsMaterial( { size: SceneParams.dotSize, sizeAttenuation: false, color: SceneParams.dotColor} );
      // var dotMaterial = new THREE.PointsMaterial( { size: SceneParams.dotSize, sizeAttenuation: false} );
      // dotMaterial.color.setHex(SceneParams.dotColor);
      var dot = new THREE.Points( dotGeometry, dotMaterial );
      Scene.scene.add(dot);

      prev_point = next;
      prev_vert_index = index

    } else if (Scene.scene.children.length > 0){ // fade out
      Scene.scene.remove(Scene.scene.children[Scene.scene.children.length - 1]);
    }
  }
  if (SceneParams.spin && !backwards && Scene.scene.children.length > ppi * 70) {
    ngon.spin();
    // if (!spun) {
    //   ngon.spin();
    //   spun = true;
    // } else {
    //   ngon.reverseSpin();
    //   spun = false;
    // }
  } // todo: reverse spin!
  //   // for testing: place a dot at each vertex
  // for (let v of ngon.geometry.vertices) {
  //   var dotGeometry = new THREE.Geometry();
  //   dotGeometry.vertices.push(v);
  //   var dotMaterial = new THREE.PointsMaterial( { size: 10, sizeAttenuation: false } );
  //   var dot = new THREE.Points( dotGeometry, dotMaterial );
  //   Scene.scene.add(dot);
  // }
};

Sim.spin = function() {
  if (!SceneParams.spin) {
    Sim.restartNgon();
  }
}


Sim.restartNgon = function() {
  if (SceneParams.pause) {
    return;
  }
  // remove old verts
  while(Scene.scene.children.length > 0) {
    Scene.scene.remove(Scene.scene.children[0]); 
  }
  // recreate the ngon data structure
  ngon = new Ngon(SceneParams.nverts, SceneParams.sideLength, x_offset, y_offset);
  Scene.ngon.vertices = ngon.vertices;
}

Sim.tile = function() {
  SceneParams.nverts = 4;
}

// Update the scene to reflect changes made in the GUI.
Sim.update = function() {
  // Sim.placeObject(SceneParams.object);
  // Sim.pinCloth(SceneParams.pinned);
  MAX_ITERATIONS = SceneParams.iterations;
}
