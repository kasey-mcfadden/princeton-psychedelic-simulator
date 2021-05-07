"use strict";

function computeBoundingBox(vertices) {
    // Compute the screen-space bounding box for the triangle defined in projectedVerts[0-2].
    // We will need to call this helper function in the shading functions
    // to loop over pixel locations in the bounding box for rasterization.
  
    var box = {};
    box.minX = -1;
    box.minY = -1;
    box.maxX = -1;
    box.maxY = -1;
  
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 14 lines of code.
  
    // initialize box bounds to first vertex
    box.minX = vertices[0].x;
    box.maxX = vertices[0].x;
    box.minY = vertices[0].y;
    box.maxY = vertices[0].y;
  
    // for the other two vertices, update box if you see a better min/max x or y
    for (var i = 1; i < 3; i++) {
      let v = vertices[i];
      let x = v.x;
      let y = v.y;
  
      if (x < box.minX) {
        box.minX = x;
      }
      if (x > box.maxX) {
        box.maxX = x;
      }
      if (y < box.minY) {
        box.minY = y;
      }
      if (y > box.maxY) {
        box.maxY = y;
      }
    }
  
    box.minX = Math.max(box.minX, 0);
    box.minY = Math.max(box.minY, 0);
  
    // ----------- STUDENT CODE END ------------
    return box;
};

// Triangle constructor
function Triangle(sideLength) {
    this.sideLength = sideLength;
    this.height = sideLength * (Math.sqrt(3)/2);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, this.height / 2, 0));
    geometry.vertices.push(new THREE.Vector3(-sideLength / 2, -this.height / 2, 0));
    geometry.vertices.push(new THREE.Vector3(sideLength / 2, -this.height / 2, 0));
    geometry.vertices.push(new THREE.Vector3(0, this.height / 2, 0));

    // this.vertices = geometry.vertices;

    this.boundingBox = computeBoundingBox(geometry.vertices);

    var tri = new THREE.Triangle(geometry.vertices[0], geometry.vertices[1], geometry.vertices[2]);
    var normal = tri.getNormal(new THREE.Vector3());

    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(tri.a);
    // geometry.vertices.push(tri.b);
    // geometry.vertices.push(tri.c);

    geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
    this.geometry = geometry;
    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    this.mesh = mesh;
    // this.material = 

//   initParameterizedPosition(x, y, this.position);
//   initParameterizedPosition(x, y, this.previous);
//   initParameterizedPosition(x, y, this.original);

//   this.netForce = new THREE.Vector3(); // net force acting on particle
//   this.mass = mass; // mass of the particle
//   this.correction = new THREE.Vector3(); // offset to apply to enforce constraints
};

function random() {
    let sum_under_one = false;
    let a;
    let b;
    while(!sum_under_one) {
        a = Math.random();
        b = Math.random();
        sum_under_one = (a + b < 1);
    }
    return [a, b];
}

// reference: https://mathworld.wolfram.com/TrianglePointPicking.html
Triangle.prototype.getRandomPoint = function() {
    let v0 = triangle.geometry.vertices[0];
    let v1 = triangle.geometry.vertices[1];
    let v2 = triangle.geometry.vertices[2];

    let rand = random();

    let vec1 = new THREE.Vector3().subVectors(v1, v0);
    let vec2 = new THREE.Vector3().subVectors(v2, v0);

    vec1.multiplyScalar(rand[0]);
    // vec1.y += this.height;
    vec2.multiplyScalar(rand[1]);
    // vec2.y += this.height;
    let point = new THREE.Vector3().addVectors(vec1, vec2);
    point.y += this.height / 2;

    return point;
};

// Triangle.prototype.fractal = function() {
//     // SceneParams.number of points or something
//     for (let i = 0; i < 1000; i++) {
//         // pick a point at random
//         let point = getRandomPoint();
//         var dotGeometry = new THREE.Geometry();
//         dotGeometry.vertices.push(point);
//         var dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );
//         var dot = new THREE.Points( dotGeometry, dotMaterial );
//         Scene.add( dot );
//         // draw the next point some fraction r of the distance between it and a polygon vertex picked at random
//         // (throw out the first few points)
//     }
// };

