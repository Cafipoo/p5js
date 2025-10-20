import * as THREE from 'three'; 
import { vertexShader } from './shaders/vertex.glsl.js'; 
import { fragmentShader } from './shaders/fragment.glsl.js'; 
 
const scene = new THREE.Scene(); 
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); 
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement); 
 
const geometry = new THREE.PlaneGeometry(2, 2); 
const material = new THREE.ShaderMaterial({ 
   vertexShader, 
   fragmentShader 
}); 
const mesh = new THREE.Mesh(geometry, material); 
scene.add(mesh); 
 
function onWindowResize() {
   // Mettre à jour la taille du renderer
   renderer.setSize(window.innerWidth, window.innerHeight);
   
   // Mettre à jour la caméra orthographique
   camera.left = -1;
   camera.right = 1;
   camera.top = 1;
   camera.bottom = -1;
   camera.updateProjectionMatrix();
}

// Écouter les événements de redimensionnement
window.addEventListener('resize', onWindowResize);

function animate() { 
   renderer.render(scene, camera); 
   requestAnimationFrame(animate); 
} 
animate();