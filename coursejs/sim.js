var Sim = Sim || {};

var randomPoints;
var triangle;
var ngon;
var prev_point;
var backwards = false;
var first = true;
var prev_vert_index;
var prev_prev_vert_index;
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
        for (let i = 0; i < ngon.vertices.length; i++) {
          ngon.vertices[i] = ngon.origVerts[i].clone();
        }
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
      let clockwise = prev_vert_index - 1;
      if (clockwise < 0) {
        clockwise = this.nverts - 1;
      }
      let anticlockwise = prev_vert_index + 1;

      let adj = [];
      if (prev_vert_index === undefined) {
        prev_vert_index = 0;
        prev_prev_vert_index = 0;
      }
      // currently chosen vertex cannot neighbor prev vertex if prev == prev prev
      if (prev_vert_index == prev_prev_vert_index) {
        let lower = prev_vert_index - 1;
        if (lower < 0) {
          lower = ngon.nverts - 1;
        }
        let upper = prev_vert_index + 1;
        if (upper >= ngon.nverts) {
          upper = 0;
        }
        adj.push(lower);
        adj.push(upper);
      }

      let restricted_vert = [];
      if (SceneParams.restrict === "1") {
        restricted_vert.push(prev_vert_index);
      } else if (SceneParams.restrict === "2") {
        restricted_vert.push(clockwise);
      } else if (SceneParams.restrict === "3") {
        restricted_vert = adj;
      }
      let index = ngon.getRandomVertexIndex(SceneParams.restrict, restricted_vert);

      // check if it's the first iteration
      if (prev_point === undefined || prev_vert_index === undefined) {
        prev_point = point;
        prev_vert_index = index;
        prev_prev_vert_index = index;
        return;
      }
      let v = ngon.vertices[index].clone();

      // get the next point (some fraction r of the distance between it and a polygon vertex picked at random)
      let next = new THREE.Vector3().subVectors(v, prev_point);
      next.multiplyScalar(SceneParams.r);

      // add the point to the scene as a dot
      var dotGeometry = new THREE.Geometry();
      dotGeometry.vertices.push(next);
      var dotMaterial = new THREE.PointsMaterial( { size: SceneParams.dotSize, sizeAttenuation: false, color: SceneParams.dotColor} );
      var dot = new THREE.Points( dotGeometry, dotMaterial );
      Scene.scene.add(dot);

      // update globals
      prev_point = next;
      prev_vert_index = index;
      prev_prev_vert_index = prev_vert_index;

    } else if (Scene.scene.children.length > 0){ // fade out
      Scene.scene.remove(Scene.scene.children[Scene.scene.children.length - 1]);
    }
  }
  if (SceneParams.spin && !backwards && Scene.scene.children.length > ppi * 70) {
    ngon.spin();
  }
};

Sim.tile = function() {
  const SECONDS = 50;

  for (i = 0; i < SECONDS; i++) {
    // create many shapes
    let ngons = [];
    let offDist = 2 * ngon.height;
    let offsets = [];
    
    for (let q = 0; q < 4; q++) {
      offsets.push([-q * offDist, - offDist]);
      offsets.push([q * offDist, - offDist]);
      offsets.push([-q * offDist, 0]);
      offsets.push([q * offDist, 0]);
      offsets.push([-q * offDist, offDist]);
      offsets.push([q * offDist, offDist]);
    }

    for (let offset of offsets) {
      n = ngon.copyWithOffset(offset[0], offset[1]);
      ngons.push(n);
    }

    for (let n of ngons) {
      for (let i = 0; i < ppi; i++) {
        if (backwards == false) { // fade in
          let point = n.getRandomPoint();
          let index = n.getRandomVertexIndex(SceneParams.restrict, prev_vert_index);

          if (prev_point === undefined || prev_vert_index === undefined) {
            prev_point = point;
            prev_vert_index = index;
            return;
          }

          let v = n.vertices[index].clone();

          // get the next point (some fraction r of the distance between it and a polygon vertex picked at random)
          let next = new THREE.Vector3().subVectors(v, prev_point);
          next.multiplyScalar(SceneParams.r);
      
          var dotGeometry = new THREE.Geometry();
          dotGeometry.vertices.push(next);
          var dotMaterial = new THREE.PointsMaterial( { size: SceneParams.dotSize, sizeAttenuation: false, color: SceneParams.dotColor} );
          var dot = new THREE.Points( dotGeometry, dotMaterial );
          Scene.scene.add(dot);

          prev_point = next;
          prev_vert_index = index;

        } else if (Scene.scene.children.length > 0){ // fade out
          Scene.scene.remove(Scene.scene.children[Scene.scene.children.length - 1]);
        }
      }
    }
  }
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

Sim.changeColor = function() {
  for (let child of Scene.scene.children) {
    child.color = SceneParams.dotColor;
  }
}

// Update the scene to reflect changes made in the GUI.
Sim.update = function() {
  // Sim.placeObject(SceneParams.object);
  // Sim.pinCloth(SceneParams.pinned);
  MAX_ITERATIONS = SceneParams.iterations;
}
