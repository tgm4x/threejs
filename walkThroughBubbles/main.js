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

const camera = new THREE.PerspectiveCamera(75, 1080/1080, 0.2, 10);
camera.position.set(0, 0, 2.5);

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
scene.add(light);

const geometry = new THREE.SphereGeometry(1, 80, 80);
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    wireframe: true,
    uniforms
});

function createBubble(z) {
    let bubble = new THREE.Mesh(geometry, material);
    bubble.position.z = z;
    bubble.rotation.set(z, z, z);
    scene.add(bubble);
    return bubble;
}

for(let z = 0; z > -50; z -= 2.5) {
    createBubble(z);
}

function update() {
    uniforms.u_time.value = clock.getElapsedTime();
    let t = uniforms.u_time.value;
    camera.position.z -= 0.01;
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
