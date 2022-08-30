import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';

const capturer = new CCapture({
    framerate: 60,
    format: 'webm',
    verbose: true,
    display: true,
    timeLimit: 13,
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1080/1920, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(1080, 1920);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const perlin = new ImprovedNoise();
const clock = new THREE.Clock();

const uniforms = {
    u_time: {type: "f", value: 0.0}
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 1, 1);
//scene.add(light);

const geometry = new THREE.SphereGeometry(1, 50, 50);
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    //wireframe: true,
    //wireframeLinewidth: 4,
    uniforms
});

const objects = [], r = [];

function createSphere(x, y, z) {
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.set(x, y, z);
    objects.push(sphere);
    r.push(Math.random()*2-1);
}

createSphere(0, 0, 0);
createSphere(2, -2, 1);
createSphere(-1, -4, 0);
createSphere(2, -6, -2);
createSphere(-1, -7, 2);
createSphere(0, -9, -1);
createSphere(1, -10, 0);

function update() {
    uniforms.u_time.value = clock.getElapsedTime();
    let t = uniforms.u_time.value;
    camera.position.y = -1.25*t;
    for(let i = 0; i < 7; i++) {
	objects[i].rotation.set(t*r[i], t*r[i], t*r[i]);
    }
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
    capturer.capture(renderer.domElement);
}

capturer.start();
render();
