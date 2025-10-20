import { fragmentShader } from './shaders/fragment.glsl.js';
import { vertexShader } from './shaders/vertex.glsl.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

const scene = new THREE.Scene();
// Ajouter un fond bleu uni
scene.background = new THREE.Color(0x4A90E2); // Bleu uni
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
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// Uniformes pour les shaders
const uniforms = {
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    iTime: { value: 0.0 },
    u_time: { value: 0.0 },
    u_ambient: { value: new THREE.Vector3(0.4, 0.4, 0.5) },
    u_lightPosition: { value: new THREE.Vector3(5, 5, 5) },
    u_fixedLightPosition: { value: new THREE.Vector3(-5, 5, 5) },
    u_displacementStrength: { value: 1.2 }, // Force du déplacement amplifiée
    u_noiseScale: { value: 3.0 } // Échelle du bruit amplifiée
};

// Matériau avec les shaders
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    transparent: true,
    side: THREE.DoubleSide
});

// Géométrie de sphère avec plus de détails pour voir la déformation
const geometry = new THREE.SphereGeometry(1.5, 64, 64);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation
function animate(time) {
    uniforms.iTime.value = time * 0.001;
    uniforms.u_time.value = time * 0.001;
    
    // Faire tourner la lumière
    const angle = time * 0.0008;
    uniforms.u_lightPosition.value.x = Math.cos(angle) * 5;
    uniforms.u_lightPosition.value.z = Math.sin(angle) * 5;
    uniforms.u_lightPosition.value.y = 5 + Math.sin(time * 0.0005) * 2;
    
    // Faire tourner légèrement le mesh
    mesh.rotation.y += 0.002;
    mesh.rotation.x += 0.001;
    
    // Animer la force du déplacement (amplifiée)
    uniforms.u_displacementStrength.value = 0.8 + Math.sin(time * 0.001) * 0.6;
    
    // Mettre à jour les contrôles
    controls.update();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate(0);

// Gestion du redimensionnement de la fenêtre
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    uniforms.iResolution.value.x = window.innerWidth;
    uniforms.iResolution.value.y = window.innerHeight;
}

window.addEventListener('resize', onWindowResize);