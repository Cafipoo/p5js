import { fragmentShader } from './shaders/fragment.glsl.js';
import { vertexShader } from './shaders/vertex.glsl.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Position de la caméra
camera.position.z = 5;

// Ajouter OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Créer les lumières
const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Lumière ambiante douce
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// Uniformes pour les shaders
const uniforms = {
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    iTime: { value: 0.0 },
    u_ambient: { value: new THREE.Vector3(0.2, 0.2, 0.3) },
    u_lightPosition: { value: new THREE.Vector3(5, 5, 5) },
    u_fixedLightPosition: { value: new THREE.Vector3(-5, 5, 5) }
};

// Matériau avec les shaders
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms
});

// Géométrie de sphère
const geometry = new THREE.SphereGeometry(1, 32, 32);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation
function animate(time) {
    uniforms.iTime.value = time * 0.001; // Temps en secondes
    
    // Faire tourner la lumière
    const angle = time * 0.001;
    uniforms.u_lightPosition.value.x = Math.cos(angle) * 5;
    uniforms.u_lightPosition.value.z = Math.sin(angle) * 5;
    
    // Mettre à jour les contrôles
    controls.update();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate(0);

// Gestion du redimensionnement de la fenêtre
function onWindowResize() {
    // Mettre à jour la taille du renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Mettre à jour la caméra perspective
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Mettre à jour la résolution dans les uniforms
    uniforms.iResolution.value.x = window.innerWidth;
    uniforms.iResolution.value.y = window.innerHeight;
}

// Écouter les événements de redimensionnement
window.addEventListener('resize', onWindowResize);
