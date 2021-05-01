import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';

var MAX_POINTS = 500;

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        let material = new THREE.LineBasicMaterial( {color: 0xff0000, linewidth: 2} );


        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            line: new THREE.Line(this.geometry, this.material),
        };


        var positions = new Float32Array(MAX_POINTS * 3);


        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        // const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // directly update line
        let positions = this.state.line.geometry.attributes.position.array;
        let x = 0;
        let y = 0; 
        let z = 0;
        let index = 0;


        for (let i = 0; i < MAX_POINTS; i++) {
            positions[index++] = x;
            positions[index++] = y;
            positions[index++] = z;

            x += (Math.random() - 0.5) * 30;
            y += (Math.random() - 0.5) * 30;
            z += (Math.random() - 0.5) * 30;
        }

        // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }
    }
}

export default SeedScene;
