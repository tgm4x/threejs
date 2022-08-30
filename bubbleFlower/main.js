import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';

const capturer = new CCapture({
    framerate: 60,
    format: 'webm',
    display: true,
    timeLimit: 15,
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1080/1920, 0.1, 1000);
camera.position.set(5.1, -5.1, 5.1);

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

const geometry = new THREE.SphereGeometry(1, 30, 30);
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    wireframe: true,
    wireframeLinewidth: 2,
    uniforms
});
//const sphere = new THREE.Mesh(geometry, material);
//scene.add(sphere);

const objects = [];
const d = 1.5;
for(let x = -d; x <= d; x += d*2) {
    for(let y = -d; y <= d; y += d*2) {
	for(let z = -d; z <= d; z += d*2) {
	    const sphere = new THREE.Mesh(geometry, material);
	    sphere.position.set(x, y, z);
	    objects.push(sphere);
	    scene.add(sphere);
	}
    }
}

function update() {
    uniforms.u_time.value = clock.getElapsedTime();
    let t = uniforms.u_time.value;
    for(let i = 1; i <= 8; i++) {
	objects[i-1].rotation.set(Math.pow(-1, i)*t/i, Math.pow(-1, i)*t/i, Math.pow(-1, i)*t/i);
    }
    //sphere.rotation.set(t, t, t);
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
    capturer.capture(renderer.domElement);
}

capturer.start();
render();
