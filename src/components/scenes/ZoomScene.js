import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color } from 'three';

const MAX_POINTS = 200;
let drawCount;

class ZoomScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to black
        this.background = new Color(0x000000);
        let geometry = new THREE.BufferGeometry();

        // attributes
        let positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // drawcalls
        drawCount = 2; // draw the first 2 points, only
        geometry.setDrawRange(0, drawCount);

        // material
        let material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

        // line
        let line = new THREE.Line( geometry,  material );
        this.line = line;
        this.add(this.line);

        // update positions
        this.updatePositions();
    }
    
    updatePositions() {
        let positions = this.line.geometry.attributes.position.array;
    
        let x = 0;
        let y = 0;
        let z = 0;
        let index = 0;

        for ( let i = 0; i < MAX_POINTS; i++ ) {
            positions[ index ++ ] = x;
            positions[ index ++ ] = y;
            positions[ index ++ ] = z;
    
            x += ( Math.random() - 0.5 ) * 2;
            y += ( Math.random() - 0.5 ) * 2;
            z += ( Math.random() - 0.5 ) * 2;
        }
        this.animate();
        // console.log(positions)
    }

    animate() {
        drawCount = ( drawCount + 1 ) % MAX_POINTS;
        this.line.geometry.setDrawRange( 0, drawCount );
        this.add(this.line);
    
        if ( drawCount == 0 ) {
    
            // periodically, generate new data
            this.updatePositions();
            this.line.geometry.attributes.position.needsUpdate = true; // required after the first render
            this.line.material.color.setHSL( Math.random(), 1, 0.5 );
            this.add(this.line);
        }
    }
}

export default ZoomScene;
