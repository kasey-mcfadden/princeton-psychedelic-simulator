"use strict";

// Triangle constructor
function Triangle(sideLength) {
    this.height = sideLength * (Math.sqrt(3)/2);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, this.height / 2, 0));
    geometry.vertices.push(new THREE.Vector3(-sideLength / 2, -this.height / 2, 0));
    geometry.vertices.push(new THREE.Vector3(sideLength / 2, -this.height / 2, 0));
    geometry.vertices.push(new THREE.Vector3(0, this.height / 2, 0));

    this.geometry = geometry;
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
    vec2.multiplyScalar(rand[1]);

    let point = new THREE.Vector3().addVectors(vec1, vec2);
    point.y += this.height / 2;

    return point;
};


// reference: https://mathworld.wolfram.com/TrianglePointPicking.html
Triangle.prototype.spin = function() {
  let v0 = triangle.geometry.vertices[0].clone();
  let v1 = triangle.geometry.vertices[1].clone();
  let v2 = triangle.geometry.vertices[2].clone();

  let SCALE = 1.05;

  // v0.multiplyScalar(SCALE);
  // v1.multiplyScalar(SCALE);
  // v2.multiplyScalar(SCALE);

  let v01 = new THREE.Vector3().subVectors(v1, v0).multiplyScalar(SCALE);
  let v12 = new THREE.Vector3().subVectors(v2, v1).multiplyScalar(SCALE);
  let v20 = new THREE.Vector3().subVectors(v0, v2).multiplyScalar(SCALE);

  v0.add(v01);
  v1.add(v12);
  v2.add(v20);

  triangle.geometry.vertices[0] = v0;
  triangle.geometry.vertices[1] = v1;
  triangle.geometry.vertices[2] = v2;
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

