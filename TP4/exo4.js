import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import Dog from './Dog.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Fog
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

// Light
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(-50, 50, 50);
light.target.position.set(0, 0, 0);
scene.add(light);
const dlHelper = new THREE.DirectionalLightHelper(light);
scene.add(dlHelper);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
const camHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(camHelper);

// Add a second light on the other side
let light2 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
light2.position.set(50, 50, -50);
light2.target.position.set(0, 0, 0);
scene.add(light2);

// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xcbcbcb,
    }));
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane);

// Grid helper
const gridHelper = new THREE.GridHelper(100, 40, 0x000000, 0x000000);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(10, 10, 20);
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// Resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Stats
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// GUI
const gui = new GUI();
const params = {
    showHelpers: true
}
gui.add(params, "showHelpers");

const dog = new Dog();
scene.add(dog);
dog.init();

// Timelines
let jumpTl = gsap.timeline();
let walkTl = gsap.timeline();

// Conditional bounce
gsap.registerPlugin(CustomEase);
document.addEventListener('keydown', (event) => {
    if ((event.key === ' ') && (!jumpTl.isActive())) {
        console.log("jump");
        idleTl.pause(0);
        jumpTl.to(dog.params, {
            y: 5,
            // ease: "power1.inOut",
            ease: CustomEase.create("custom", "M0,0 C0.015,0.03 0.059,-0.146 0.074,-0.088 0.135,0.151 0.568,1 1,1 "),
            repeat: 1,
            yoyo: true,
            duration: 0.5
        });
        jumpTl.to(dog.params, {
            bodyRotation: Math.PI * 2,
            // ease: "power1.inOut",
            ease: CustomEase.create("custom", "M0,0 C0.015,0.03 0.059,-0.146 0.074,-0.088 0.135,0.151 0.568,1 1,1 "),
            duration: 1
        }, "<");
        jumpTl.to(dog.params, {
            bodyRotation: 0,
            duration: 0
        }, ">");
    }
});


// Conditional walk
let walkSpeed = 0;
walkTl.to(dog.params, {
    walkRotation: degreesToRadians(45),
    repeat: 1,
    yoyo: true,
    duration: 0.25
});
walkTl.to(dog.params, {
    walkRotation: degreesToRadians(-45),
    repeat: 1,
    yoyo: true,
    duration: 0.25
}, ">");
walkTl.pause(0);
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        walkSpeed += 0.035;
        console.log("walk");
        if (!walkTl.isActive()) {
            console.log("walk");
            idleTl.pause(0);
            walkTl.restart();
        }
    }
});

// Rotate Left and Right
let rySpeed = 0;
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        idleTl.pause(0);
        rySpeed += 0.05;
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        idleTl.pause(0);
        rySpeed -= 0.05;
    }
});

// Idle animation
let idleTl = gsap.timeline();
idleTl.to(dog.params,
    {
        headRotation: 0.25,
        repeat: 1,
        yoyo: true,
        duration: 0.75,
        delay: 2.5,
        ease: "back.out"
    })
idleTl.to(dog.params,
    {
        leftEyeScale: 1.25,
        repeat: 1,
        yoyo: true,
        duration: 1,
        ease: "elastic.in"
    }, ">2.2")

// Main loop
gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;

    if ((!jumpTl.isActive()) &&
        (!idleTl.isActive()) &&
        (!walkTl.isActive()) &&
        (rySpeed < 0.01) &&
        (walkSpeed < 0.01)) {
        idleTl.restart();
    }
    else if ((!walkTl.isActive() && walkSpeed > 0.025)) {
        walkTl.restart();
    }

    dog.params.x += walkSpeed * Math.sin(dog.params.ry);
    dog.params.z += walkSpeed * Math.cos(dog.params.ry);
    walkSpeed *= 0.97;
    dog.params.ry += rySpeed;
    rySpeed *= 0.9;
    dog.update();
    controls.update();
    stats.update();
    renderer.render(scene, camera);
});

