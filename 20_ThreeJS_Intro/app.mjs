import * as THREE from '../99_Lib/three.module.js';
import { add } from './js/geometry.mjs';
import { mouse } from './js/interaction2D.mjs';

console.log("ThreeJs (local) " + THREE.REVISION);
const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();

// Lichter
scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 2, 0);
scene.add(light);

const cursor = add(1, scene);
mouse(cursor);

const defaultCube = new THREE.Mesh(geometry, material);
scene.add(defaultCube);
defaultCube.position.y = 0.2;
defaultCube.position.z = -2;

let counter = 0, objects = [];
for (let x = -1; x < 1; x += 0.3) {
    for (let y = -1; y < 1; y += 0.3) {
        const o = (++counter % 2 == 0) ? add(4, scene) : add(6, scene);
        o.position.x = x;
        o.position.y = y;
        o.position.z = -2;
        objects.push(o);
    }

}


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// animation

function animate(time) {

    defaultCube.rotation.x = time / 2000;
    defaultCube.rotation.y = time / 1000;

    for (const o of objects) {
        o.rotation.x = time / 2000;
        o.rotation.y = time / 1000;

    }
    renderer.render(scene, camera);

}