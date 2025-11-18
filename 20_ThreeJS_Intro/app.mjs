import * as THREE from '../99_Lib/three.module.js';
import { add } from './js/geometry.mjs';

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


const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

mesh.position.y = 0.2;

add(4, scene);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// animation

function animate(time) {

    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    renderer.render(scene, camera);

}