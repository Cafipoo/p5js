import { fragmentShader } from './shaders/fragment.glsl.js';
import { vertexShader } from './shaders/vertex.glsl.js';
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Uniformes
const uniforms = {
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    iMouse: { value: new THREE.Vector2(0, 0) },
    iTime: { value: 0.0 }
};

// Matériau avec les shaders
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms
});

// Géométrie et mesh
const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Pas besoin de positionner la caméra orthographique

// Animation
function animate(time) {
    uniforms.iTime.value = time * 0.001; // Temps en secondes
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate(0);

// Gestion du redimensionnement de la fenêtre
function onWindowResize() {
    // Mettre à jour la taille du renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Mettre à jour la caméra orthographique
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();
    
    // Mettre à jour la résolution dans les uniforms
    uniforms.iResolution.value.x = window.innerWidth;
    uniforms.iResolution.value.y = window.innerHeight;
}

// Écouter les événements de redimensionnement
window.addEventListener('resize', onWindowResize);

// Gestion de la souris
window.addEventListener('mousemove', (event) => {
    uniforms.iMouse.value.x = event.clientX;
    uniforms.iMouse.value.y = window.innerHeight - event.clientY;
});
