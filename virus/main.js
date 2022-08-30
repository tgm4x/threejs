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

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(1080, 1080);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const perlin = new ImprovedNoise();
const clock = new THREE.Clock();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, 100, 100);
light.castShadow = true;
light.shadow.mapSize = new THREE.Vector2(2048, 2048);
scene.add(light);

const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const mainSphereGeometry = new THREE.SphereGeometry(2, 100, 100);
const subSphereGeometry = new THREE.SphereGeometry(0.2, 100, 100);
const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);

const total = 40;
const mainSpheres = [];
const rotationX = [], rotationY = [], rotationZ = [];
for (let i = 0; i < total; i++) {
    const mainSphere = new THREE.Mesh(mainSphereGeometry, sphereMaterial);
    mainSpheres.push(mainSphere);
    rotationX.push((Math.random() * 1.6 - 0.8) / 60);
    rotationY.push((Math.random() * 1.6 - 0.8) / 60);
    rotationZ.push((Math.random() * 1.6 - 0.8) / 60);
    const subSphere = new THREE.Mesh(subSphereGeometry, sphereMaterial);
    const cylinder = new THREE.Mesh(cylinderGeometry, sphereMaterial);
    subSphere.position.set(0, 2.5, 0);
    cylinder.position.set(0, 2, 0);
    scene.add(mainSphere);
    mainSphere.add(subSphere);
    mainSphere.add(cylinder);

    mainSphere.castShadow = true;
    mainSphere.receiveShadow = true;
    subSphere.castShadow = true;
    subSphere.receiveShadow = true;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
}

function update() {
    for (let i = 0; i < total; i++) {
        mainSpheres[i].rotation.x += rotationX[i];
        mainSpheres[i].rotation.y += rotationY[i];
        mainSpheres[i].rotation.z += rotationZ[i];
    }
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
    capturer.capture(renderer.domElement);
}

//capturer.start();
render();
