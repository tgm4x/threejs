import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';

const capturer = new CCapture({
    framerate: 60,
    format: 'webm',
    display: true,
    timeLimit: 10,
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1080/1080, 0.1, 1000);
camera.position.set(1, 1, 1);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(1080, 1080);
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

const geometry = new THREE.BoxGeometry(1, 1, 1, 20, 20, 20);
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    wireframe: true,
    wireframeLinewidth: 2,
    uniforms
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

function update() {
    uniforms.u_time.value = clock.getElapsedTime();
    let t = uniforms.u_time.value/3;
    sphere.rotation.set(t, t, t);
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
    capturer.capture(renderer.domElement);
}

capturer.start();
render();
