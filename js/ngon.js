// ngon constructor
function Ngon(nverts, sideLength, offset) {
    this.nverts = nverts;
    this.sideLength = sideLength;

    // reference for trig calculations: https://calcresource.com/geom-ngon.html
    let circumradius = sideLength / (2 * Math.sin(Math.PI / nverts));
    let inradius = sideLength / (2 * Math.tan(Math.PI / nverts));
    if (nverts % 2 == 0) { // even verts
        this.height = 2 * inradius;
    } else { // odd verts
        this.height = inradius + circumradius;
    }

    let angle = 2 * Math.PI / nverts;
    var geometry = new THREE.Geometry();
    for (let i = 0; i < nverts; i++) {
        let x = this.height / 2 * Math.sin(i * angle) + offset;
        let y = this.height / 2 * Math.cos(i * angle) + offset;
        let v = new THREE.Vector3(x, y, 0);
        geometry.vertices.push(v);
    }

    this.vertices = geometry.vertices;
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
    let v0 = ngon.vertices[0];
    let v1 = ngon.vertices[1];
    let v2 = ngon.vertices[2];

    let rand = random();

    let vec1 = new THREE.Vector3().subVectors(v1, v0);
    let vec2 = new THREE.Vector3().subVectors(v2, v0);

    vec1.multiplyScalar(rand[0]);
    vec2.multiplyScalar(rand[1]);
    let point = new THREE.Vector3().addVectors(vec1, vec2);
    point.y += this.height / 2;

    return point;
};


Ngon.prototype.spin = function() {
  let SCALE = 1.05;

  let offsets = [];

  for (let i = 0; i < this.nverts - 1; i++) {
    let v1 = this.vertices[i].clone();
    let v2 = this.vertices[i + 1].clone();
    let v12 = new THREE.Vector3().subVectors(v2, v1).multiplyScalar(SCALE);
    offsets.push(v12);
  }

  let firstV = this.vertices[0].clone();
  let lastV = this.vertices[this.nverts - 1].clone();
  let v12 = new THREE.Vector3().subVectors(firstV, lastV).multiplyScalar(SCALE);
  offsets.push(v12);

  for (let i = 0; i < this.nverts; i++) {
    this.vertices[i].add(offsets[i]);
  }
};


Ngon.prototype.getRandomVertexIndex = function(restrict, restrictedVertex) {
    if (!restrict) {
        return Math.round(Math.random() * (this.nverts - 1));
    }
    let goodV = false;
    let index;
    while (!goodV) {
        index = Math.round(Math.random() * (this.nverts - 1));
        if (index != restrictedVertex) {
          goodV = true;
        }
    }
    return index;
}