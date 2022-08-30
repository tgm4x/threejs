import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';

const capturer = new CCapture({
    framerate: 1,
    format: 'png',
    timeLimit: 5,
});

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(1080*3/-50, 1080*3/50,
    1080/50, 1080/-50, -500, 1000);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(1080*3, 1080);
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

const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    wireframe: true,
    wireframeLinewidth: 4,
    uniforms
});

const objects = [];

function createSphere(fragment, x) {
    const geometry = new THREE.SphereGeometry(10, fragment, fragment);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, 0, 0);
    scene.add(sphere);
    objects.push(sphere);
}

createSphere(200, -50);
createSphere(50, -30);
createSphere(40, -10);
createSphere(25, 10);
createSphere(15, 30);
createSphere(10, 50);

function update() {
    uniforms.u_time.value = clock.getElapsedTime();
    let t = uniforms.u_time.value;
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
    capturer.capture(renderer.domElement);
}

capturer.start();
render();
