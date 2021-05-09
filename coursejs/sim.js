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
const offset = 0;

Sim.init = function() {

  ngon = new Ngon(SceneParams.nverts, SceneParams.sideLength, offset);
  Sim.update();
}

// Performs one timestep of the simulation.
// This function is repeatedly called in a loop, and its results are
// then rendered to the screen.
// For more info, see animate() in render.js.
Sim.simulate = function() {
  if (!SceneParams.pause) {
    if (SceneParams.fade && Scene.scene.children.length > MAX_ITERATIONS) {
      backwards = true;
    }
    if (Scene.scene.children.length == 0) {
      backwards = false;
    }
    if (Scene.scene.children.length < MAX_ITERATIONS + 2 * ppi) {
      Sim.chaos();
    }
  }
}



Sim.chaos = function() {

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
        var dotMaterial = new THREE.PointsMaterial( { size: SceneParams.dotSize, sizeAttenuation: false } );
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

};


Sim.restartNgon = function() {

  // remove old verts
  while(Scene.scene.children.length > 0) {
    Scene.scene.remove(Scene.scene.children[0]); 
  }
  // recreate the ngon data structure
  ngon = new Ngon(SceneParams.nverts, SceneParams.sideLength, offset);
  Scene.ngon.vertices = ngon.vertices;
}

// Update the scene to reflect changes made in the GUI.
Sim.update = function() {
  // Sim.placeObject(SceneParams.object);
  // Sim.pinCloth(SceneParams.pinned);
}
