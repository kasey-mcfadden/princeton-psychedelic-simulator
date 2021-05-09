var Sim = Sim || {};

var randomPoints;
var triangle;
var prev_point;

Sim.init = function() {
  // Points by which cloth will be suspended in "Random" pinning mode.
  randomPoints = [];

  // The cloth object being simulated.
  triangle = new Triangle(SceneParams.sideLength);
  // cloth = new Cloth(SceneParams.xSegs, SceneParams.ySegs, SceneParams.fabricLength);

  Sim.update();
}

// Performs one timestep of the simulation.
// This function is repeatedly called in a loop, and its results are
// then rendered to the screen.
// For more info, see animate() in render.js.
Sim.simulate = function() {
  Sim.fractal();
}


Sim.fractal = function() {
  // SceneParams.number of points or something
  // for (let i = 0; i < 1000; i++) {
  // pick a point at random
  let point = triangle.getRandomPoint();
  if (prev_point === undefined) {
    prev_point = point;
    return;
  }
  for (let i = 0; i < SceneParams.speed; i++) {
    let index = Math.round(Math.random() * 2);
    let v = triangle.geometry.vertices[index].clone();
    // draw the next point some fraction r of the distance between it and a polygon vertex picked at random
    let next = new THREE.Vector3().subVectors(v, prev_point);
    next.multiplyScalar(SceneParams.r);

    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(next);
    var dotMaterial = new THREE.PointsMaterial( { size: SceneParams.dotSize, sizeAttenuation: false } );
    var dot = new THREE.Points( dotGeometry, dotMaterial );
    Scene.scene.add(dot);
    prev_point = next;
  }

  // spin
  triangle.spin();
};


// restartCloth() is used when we change a fundamental cloth property with a slider
// and therefore need to recreate the cloth object from scratch
Sim.restartCloth = function() {
  // // Remove the old cloth from the scene
  // Scene.scene.remove(Scene.cloth.mesh);
  // if (Scene.cloth.constraints) {
  //   Scene.scene.remove(Scene.cloth.constraints.group);
  // }
  // Scene.cloth.constraints = undefined;

  // // recreate the logical Cloth data structure
  // let xSegs = SceneParams.xSegs;
  // let ySegs = SceneParams.ySegs;
  // let fabricLength = SceneParams.fabricLength;
  // cloth = new Cloth(xSegs, ySegs, fabricLength);

  // // recreate cloth geometry
  // Scene.cloth.geometry = new THREE.ParametricGeometry(initParameterizedPosition, xSegs, ySegs);
  // Scene.cloth.geometry.dynamic = true;

  // // recreate cloth mesh
  // Scene.cloth.mesh = new THREE.Mesh(Scene.cloth.geometry, Scene.cloth.material);
  // Scene.cloth.mesh.position.set(0, 0, 0);
  // Scene.cloth.mesh.castShadow = true;

  // Scene.scene.add(Scene.cloth.mesh); // adds the cloth to the scene
}

Sim.restartTriangle = function() {
  // remove old triangle outline
  // Scene.scene.remove(Scene.triangle.mesh);

  while(Scene.scene.children.length > 0){ 
    Scene.scene.remove(Scene.scene.children[0]); 
}

  // recreate the triangle data structure
  let sideLength = SceneParams.sideLength;
  triangle = new Triangle(sideLength);

  Scene.triangle.geometry = triangle.geometry;
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
