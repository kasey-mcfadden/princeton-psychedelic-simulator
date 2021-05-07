"use strict";

var Scene = Scene || {};

Scene.init = function() {
  Scene.loader = new THREE.TextureLoader();


  // Make a canvas to draw your simulation on
  Scene.container = Scene.buildContainer();
  Scene.stats = Scene.buildStats();

  // scene (First thing you need to do is set up a scene)
  Scene.scene = Scene.buildScene();

  // camera (Second thing you need to do is set up the camera)
  Scene.camera = Scene.buildCamera();

  // renderer (Third thing you need is a renderer)
  Scene.renderer = Scene.buildRenderer();

  // controls, so we can look around
  Scene.controls = Scene.buildControls();

  // lights (fourth thing you need is lights)
  Scene.lights = Scene.buildLights();

  // Now fill the scene with objects
  // Scene.fractal = Scene.buildFractal();
  Scene.triangle = Scene.buildTriangle();

  Scene.update();
}

Scene.buildContainer = function() {
  let container = document.createElement("div");
  document.body.appendChild(container);

  return container;
}

Scene.buildStats = function() {
  // This gives us stats on how well the simulation is running
  let stats = new Stats();
  Scene.container.appendChild(stats.domElement);

  return stats;
}

Scene.buildScene = function() {
  let scene = new THREE.Scene();
  scene.background = new THREE.Color('#000000');

  return scene;
}

Scene.buildCamera = function() {
  let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.y = 450;
  camera.position.z = 1500;
  Scene.scene.add(camera);

  return camera;
}

Scene.buildRenderer = function() {
  let renderer = new THREE.WebGLRenderer({
    antialias: true,
    devicePixelRatio: 1,
    preserveDrawingBuffer: true, // save drawing frames for screenshots
   });
  renderer.setSize(window.innerWidth, window.innerHeight);

  Scene.container.appendChild(renderer.domElement);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;

  return renderer;
}

// mouse controls (so you can look around the scene)
Scene.buildControls = function() {
  // controls = new THREE.TrackballControls(camera, renderer.domElement);
  let controls = new THREE.OrbitControls(Scene.camera, Scene.renderer.domElement);
  controls.update();

  return controls;
}

Scene.buildLights = function() {
  let light = new THREE.DirectionalLight(0xdfebff, 1.75);
  Scene.scene.add(new THREE.AmbientLight(0x666666));
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  // If cloth shadows are getting clipped, then d must be a larger number
  let d = 350;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 1000;

  Scene.scene.add(light);
  return light;
}



Scene.buildBox = function() {
  let box = {}

  // create a box mesh
  box.geometry = new THREE.BoxGeometry(250, 100, 250);
  box.material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.15, // clipping is an issue, so set a low opacity
  });
  box.mesh = new THREE.Mesh(box.geometry, box.material);
  box.mesh.position.x = 0;
  box.mesh.position.y = 0;
  box.mesh.position.z = 0;
  box.mesh.receiveShadow = true;
  box.mesh.castShadow = true;

  box.geometry.computeBoundingBox();
  box.boundingBox = box.geometry.boundingBox.clone();

  Scene.scene.add(box.mesh);
  return box;
}

Scene.buildTriangle = function() {
  // Scene.scene.add(cloth.mesh); // add cloth to the scene
  // return cloth;
  let triangle = {};
  let sideLength = SceneParams.sideLength;
  let height = sideLength * (Math.sqrt(3)/2);
  
  let v1 = new THREE.Vector3(0, height / 2, 0);
  let v2 = new THREE.Vector3(-sideLength / 2, -height / 2, 0);
  let v3 = new THREE.Vector3(sideLength / 2, -height / 2, 0);
  var tri = new THREE.Triangle(v1, v2, v3);
  var normal = tri.getNormal(new THREE.Vector3());

  var geometry = new THREE.Geometry();
  geometry.vertices.push(tri.a);
  geometry.vertices.push(tri.b);
  geometry.vertices.push(tri.c);

  // triangle.vertices = geometry.vertices;

  geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
  var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
  
  triangle.sideLength = sideLength;
  triangle.geometry = geometry;
  triangle.mesh = mesh;

  Scene.scene.add(triangle.mesh);

  // triangle.outline = new THREE.Mesh(
  //   geometry,
  //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // );
  // // scene.add(line);
  // Scene.scene.add(triangle.outline);
  return triangle;
}


Scene.createConstraintLine = function(constraint) {
  if (!Scene.constraintMaterials) {
    let mats = [];
    mats.push(new THREE.LineBasicMaterial({color: 0xff0000}));
    mats.push(new THREE.LineBasicMaterial({color: 0x00ff00}));
    mats.push(new THREE.LineBasicMaterial({color: 0x0000ff}));
    mats.push(new THREE.LineBasicMaterial({color: 0x000000}));
    Scene.constraintMaterials = mats;
  }

  let line = {};
  let points = [constraint.p1.position, constraint.p2.position];
  line.geometry = new THREE.BufferGeometry().setFromPoints( points );

  // figure out materials
  let mats = Scene.constraintMaterials;
  let mat = mats[3]; // black
  let d = constraint.distance;
  let rest = SceneParams.restDistance;
  let restB = rest * SceneParams.restDistanceB;
  let restS = rest * SceneParams.restDistanceS;
  if      (d == rest)   mat = mats[0];
  else if (d == restS)  mat = mats[1];
  else if (d == restB)  mat = mats[2];

  line.mesh = new THREE.Line(line.geometry, mat);
  // Scene.scene.add(line.mesh);
  return line;
}

Scene.update = function() {
  // Repair broken SceneParams colors
  Params.repairColors();
  

  // Reset textures
  // Scene.updateClothTexture(SceneParams.clothTexture);

}
