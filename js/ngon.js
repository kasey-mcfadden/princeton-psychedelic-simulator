// ngon constructor
function Ngon(nverts, sideLength) {
    this.nverts = nverts;
    this.sideLength = sideLength;
    this.height = sideLength * (Math.sqrt(3)/2);

    let angle = 360.0 / nverts;
    var geometry = new THREE.Geometry();
    let first;
    for (let i = 0; i < nverts; i++) {
        let x = sideLength / 2 * Math.sin(i * angle);
        let y = sideLength / 2 * Math.cos(i * angle);
        let v = new THREE.Vector3(x, y, 0);
        if (i == 0) {
            first = v;
        }
        geometry.vertices.push(v);
    }

    this.boundingBox = computeBoundingBox(geometry.vertices);


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
Ngon.prototype.getRandomPoint = function() {
    let v0 = ngon.geometry.vertices[0];
    let v1 = ngon.geometry.vertices[1];
    let v2 = ngon.geometry.vertices[2];

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