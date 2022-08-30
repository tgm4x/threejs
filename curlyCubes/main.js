import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';

const capturer = new CCapture({
    framerate: 60,
    format: 'webm',
    display: true,
    timeLimit: 20,
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.y = -4;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(1080, 1080);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const perlin = new ImprovedNoise();
const clock = new THREE.Clock();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, -1);
scene.add(light);

const objects = [];

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
objects.push(sphere);

for(let i = 0; i < 20; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    objects[i].add(sphere);
    sphere.position.set(0.6, 0, 0);
    objects.push(sphere);
}

function update() {
    objects.forEach((objects) => {
	objects.rotation.x = clock.getElapsedTime()/3;
	objects.rotation.y = clock.getElapsedTime()/3;
	objects.rotation.z = clock.getElapsedTime()/3;
    });

    const wp = new THREE.Vector3();
    objects[10].getWorldPosition(wp);
    camera.position.set(wp.x, wp.y+5, wp.z);
    camera.lookAt(wp);
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
    capturer.capture(renderer.domElement);
}

capturer.start();
render();
