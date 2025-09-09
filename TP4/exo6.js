import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import Bullet from './Bullet.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
const axesHelper = new THREE.AxesHelper(10);
const CAMERA_OFFSET = new THREE.Vector3(0, 9, -25);
scene.add(axesHelper);

// Fog
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

// Light setup for better visibility
// Main directional light (sun)
let light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
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

// Ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

// Fill light from the opposite side
const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.4);
fillLight.position.set(50, 30, -50);
scene.add(fillLight);

// Rim light from behind for better definition
const rimLight = new THREE.DirectionalLight(0xFFE4B5, 0.3);
rimLight.position.set(0, 20, -30);
scene.add(rimLight);

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
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
camera.position.set(-5, 3, 10);
camera.lookAt(0, 2, 0);
// Don't set initial lookAt here - will be handled by updateCameraFollow

// Camera follow settings
const cameraOffset = new THREE.Vector3(0, 3, -15); // 15 units behind, 3 units up
const cameraTarget = new THREE.Vector3();

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.render(scene, camera);

// Resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

// Controls (disabled for automatic camera following)
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

// Robot model variables
let robot = null;
let mixer = null;
let actions = {};
let activeAction = null;
let previousAction = null;

// Smooth animation crossfade helper
function fadeToAction(name, duration) {
    previousAction = activeAction;
    activeAction = actions[name];
    if (!activeAction) return;

    if (previousAction && previousAction !== activeAction) {
        previousAction.fadeOut(duration);
    }

    activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
}

// Robot parameters for movement
const robotParams = {
    x: 0,
    y: 0,
    z: 0,
    ry: 0
};

// Compteur de tirs
let shotCounter = 0;

// Créer l'élément HTML pour afficher le compteur
const shotDisplay = document.createElement('div');
shotDisplay.id = 'shot-counter';
shotDisplay.style.position = 'fixed';
shotDisplay.style.top = '75%';
shotDisplay.style.left = '50%';
shotDisplay.style.transform = 'translate(-50%, -50%)';
shotDisplay.style.fontSize = '48px';
shotDisplay.style.fontWeight = 'bold';
shotDisplay.style.color = 'red';
shotDisplay.style.fontFamily = 'Arial, sans-serif';
shotDisplay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
shotDisplay.style.zIndex = '1000';
shotDisplay.style.pointerEvents = 'none';
shotDisplay.textContent = 'Shots: 0';
document.body.appendChild(shotDisplay);

// Load GLTF model
const loader = new GLTFLoader();
loader.load('./model/RobotExpressive.glb', (gltf) => {
    robot = gltf.scene;
    
    // Scale and position the robot
    robot.scale.setScalar(2);
    robot.position.set(0, 0, 0);
    
    // Enable shadows
    robot.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    scene.add(robot);
    
    // Setup animations
    mixer = new THREE.AnimationMixer(robot);
    
    // Store all available animations
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;
    });
    
    // Start with idle animation if available
    if (actions['Idle']) {
        activeAction = actions['Idle'];
        activeAction.reset().play();
    }
    
    // Create bullet after robot is loaded
    bullet = new Bullet(robot);
    scene.add(bullet);
    
    console.log('Robot loaded successfully');
    console.log('Available animations:', Object.keys(actions));
}, 
(progress) => {
    console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
},
(error) => {
    console.error('Error loading model:', error);
});

// Movement variables
let walkSpeed = 0;
let rySpeed = 0;
let isJumping = false;
let isWalking = false;
let isFiring = false;

// Timelines for GSAP animations
let jumpTl = gsap.timeline();
let walkTl = gsap.timeline();
let idleTl = gsap.timeline();

// Conditional bounce (jump)
gsap.registerPlugin(CustomEase);
document.addEventListener('keydown', (event) => {
    if ((event.key === ' ') && (!jumpTl.isActive()) && robot) {
        isJumping = true;
        
        // Crossfade to Jump
        if (actions['Jump']) {
            actions['Jump'].setLoop(THREE.LoopOnce);
            fadeToAction('Jump', 0.2);
        }
        
        jumpTl.to(robotParams, {
            y: 3,
            ease: CustomEase.create("custom", "M0,0 C0.015,0.03 0.059,-0.146 0.074,-0.088 0.135,0.151 0.568,1 1,1 "),
            repeat: 1,
            yoyo: true,
            duration: 0.3,
            onComplete: () => {
                isJumping = false;
                // Return to Idle
                if (actions['Idle']) {
                    fadeToAction('Idle', 0.2);
                }
            }
        });
    }
});

// Conditional walk
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && robot) {
        walkSpeed += 0.035;
        
        if (!isWalking && !isJumping) {
            isWalking = true;
            if (actions['Running']) {
                fadeToAction('Running', 0.2);
            }
        }
    }
});

// Rotate Left and Right
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && robot) {
        rySpeed += 0.05;
        if (!isWalking && !isJumping) {
            isWalking = true;
            if (actions['Walking']) {
                fadeToAction('Walking', 0.2);
            }
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && robot) {
        rySpeed -= 0.05;
        if (!isWalking && !isJumping) {
            isWalking = true;
            if (actions['Walking']) {
                fadeToAction('Walking', 0.2);
            }
        }
    }
});

let bullet = null;

// Fire bullet with 'f' key
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' && bullet && actions['ThumbsUp'] && !isFiring) {
        // Block further firing attempts
        isFiring = true;
        
        // Crossfade to ThumbsUp (punch)
        const punchAction = actions['ThumbsUp'];
        if (punchAction) {
            punchAction.setLoop(THREE.LoopOnce);
            punchAction.clampWhenFinished = true;
            fadeToAction('ThumbsUp', 0.15);
        }
        
        // Get the duration of the punch animation
        const punchDuration = punchAction._clip.duration;
        
        // Fire bullet after punch animation completes
        setTimeout(() => {
            bullet.fire();
            
            // Incrémenter le compteur de tirs
            shotCounter++;
            shotDisplay.textContent = `Shots: ${shotCounter}`;
            
            // Return to appropriate animation after a short delay
            setTimeout(() => {
                if (!isWalking && !isJumping) {
                    if (actions['Idle']) {
                        fadeToAction('Idle', 0.2);
                    }
                }
                // Re-enable firing
                isFiring = false;
            }, 100);
        }, 700); // Convert to milliseconds
    }
});

// Clock for animation mixer
const clock = new THREE.Clock();

// Main loop
gsap.ticker.add(() => {
    const delta = clock.getDelta();
    
    // Update animation mixer
    if (mixer) {
        mixer.update(delta);
    }
    
    // Update helpers visibility
    axesHelper.visible = params.showHelpers;
    dlHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;
    
    // Update robot position and rotation if loaded
    if (robot) {
        // Apply movement
        robotParams.x += walkSpeed * Math.sin(robotParams.ry);
        robotParams.z += walkSpeed * Math.cos(robotParams.ry);
        robotParams.ry += rySpeed;
        
        // Update robot transform
        robot.position.set(robotParams.x, robotParams.y, robotParams.z);
        robot.rotation.y = robotParams.ry;
        
        
        // Handle walking animation state
        if (walkSpeed < 0.01 && Math.abs(rySpeed) < 0.01 && isWalking && !isJumping) {
            isWalking = false;
            if (actions['Idle']) fadeToAction('Idle', 0.2);
        }
        
        // Damping
        walkSpeed *= 0.97;
        rySpeed *= 0.9;
    }
    
    // Update controls, stats and render
    if (bullet) {
        bullet.update();
    }
    controls.update();

    const desiredCameraPosition = robot.position.clone().add(CAMERA_OFFSET.clone().applyQuaternion(robot.quaternion));
    camera.position.lerp(desiredCameraPosition, 0.08);
    const lookAtPos = robot.position.clone();
    lookAtPos.y += 1.6;
    camera.lookAt(lookAtPos);

    stats.update();
    renderer.render(scene, camera);
});
