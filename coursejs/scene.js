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
  Scene.ngon = Scene.buildNgon();
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


Scene.buildNgon = function() {

  let ngon = {};
  let sideLength = SceneParams.sideLength;
  let nverts = SceneParams.nverts;

  // reference for trig calculations: https://calcresource.com/geom-ngon.html
  let circumradius = sideLength / (2 * Math.sin(Math.PI / nverts));
  let inradius = sideLength / (2 * Math.tan(Math.PI / nverts));
  let height;

  if (nverts % 2 == 0) { // even
    height = 2 * inradius;
  } else {
    height = inradius + circumradius;
  }
  // let height = sideLength * (Math.sqrt(3)/2);
  let angle = 2 * Math.PI / nverts;
  var geometry = new THREE.Geometry();
  for (let i = 0; i < nverts; i++) {
    let x = height / 2 * Math.sin(i * angle);
    let y = height / 2 * Math.cos(i * angle);
    let v = new THREE.Vector3(x, y, 0);
    geometry.vertices.push(v);
  }

  ngon.vertices = geometry.vertices;
  ngon.sideLength = sideLength;
  ngon.height = height;

  return ngon;
}

Scene.update = function() {
  // Repair broken SceneParams colors
  Params.repairColors();
  Scene.scene.background.setHex(SceneParams.backgroundColor);

  // Reset textures
  // Scene.updateClothTexture(SceneParams.clothTexture);

}
