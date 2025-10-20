import * as THREE from 'three';
// Three.js 3D Particle System - simple spheres rising and fading
// Emitter at the center of a ground plane

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 6);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(3, 5, 2);
scene.add(directionalLight);

// Ground plane (XZ plane)
const groundSize = 10;
const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2f2f2f, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Emitter at plane center
const emitterPosition = new THREE.Vector3(0, 0, 0);

// Shared geometry for all particles (requirement: only one SphereGeometry instance)
const sharedSphereGeometry = new THREE.SphereGeometry(0.1, 12, 12);

// We will clone materials per particle so opacity can differ
const baseParticleMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 1.0,
  roughness: 0.6,
  metalness: 0.0,
  depthWrite: false // reduces sorting artifacts with many transparent particles
});

const particles = [];

class Particle {
  constructor() {
    // Slight random offset around emitter to avoid perfect stacking
    const spawnRadius = 0.25;
    const offsetX = (Math.random() * 2 - 1) * spawnRadius;
    const offsetZ = (Math.random() * 2 - 1) * spawnRadius;

    this.material = baseParticleMaterial.clone();
    this.material.opacity = 1.0;
    this.mesh = new THREE.Mesh(sharedSphereGeometry, this.material);
    this.mesh.position.set(emitterPosition.x + offsetX, emitterPosition.y + 0.05, emitterPosition.z + offsetZ);

    this.velocity = new THREE.Vector3(
      0.02 + Math.random() * 0.02, 
      0.03 + Math.random() * 0.05,
      (Math.random() * 2 - 1) * 0.01 
    );


    this.fadeRate = 0.05 + Math.random() * 0.3; 

    scene.add(this.mesh);
  }

  update(deltaSeconds) {
    // Apply a gentle, persistent wind to the right (positive X)
    const windStrength = 0.01; // units per second^2
    this.velocity.x += windStrength * deltaSeconds;

    this.mesh.position.addScaledVector(this.velocity, deltaSeconds);

    // Fade out
    this.material.opacity -= this.fadeRate * deltaSeconds;
  }

  isDead() {
    return this.material.opacity <= 0;
  }

  dispose() {
    scene.remove(this.mesh);
    this.mesh.geometry = null; // shared geometry retained globally
    this.mesh.material.dispose();
    this.mesh = null;
    this.material = null;
  }
}

// Spawn control
const spawnPerFrame = 6; // number of particles to create each frame (adjust for perf)
const maxParticles = 1500; // hard cap to avoid runaway slowdown

// Animate
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  // Spawn new particles near the emitter
  if (particles.length < maxParticles) {
    for (let i = 0; i < spawnPerFrame; i++) {
      particles.push(new Particle());
    }
  }

  // Update and clean up
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update(delta);
    if (particle.isDead()) {
      particle.dispose();
      particles.splice(i, 1);
    }
  }

  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


