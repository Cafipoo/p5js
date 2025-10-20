import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ===== THREE.JS SETUP =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== LIGHTING =====
scene.add(new THREE.AmbientLight(0x404040, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
scene.add(dirLight);

// ===== GROUND =====
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0x2c3e50,
  transparent: true,
  opacity: 0.8,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
ground.receiveShadow = true;
scene.add(ground);

// ===== PARTICLE SYSTEM =====
const particles = [];
const particleGeometry = new THREE.SphereGeometry(0.3, 8, 6);
const particleMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 1.0,
});

class Particle3D {
  constructor(x = 0, y = 0, z = 0) {
    this.mesh = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);

    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      Math.random() * 0.05 + 0.02,
      (Math.random() - 0.5) * 0.02
    );
    this.windForce = 0.001;
    this.life = 1.0;
    this.fadeSpeed = 0.01;
  }

  update() {
    this.velocity.x += this.windForce;

    this.mesh.position.add(this.velocity);

    this.life -= this.fadeSpeed;

    const heightFactor = Math.max(0, 1 - (this.mesh.position.y + 2) / 10);
    this.mesh.material.opacity = this.life * heightFactor;

    return this.life > 0;
  }

  dispose() {
    scene.remove(this.mesh);
    this.mesh.material.dispose();
  }
}

// ===== CONTINUOUS PARTICLE CREATION =====
let particleCreationTimer = 0;
const particleCreationInterval = 100;

function createParticles() {
  for (let i = 0; i < 100; i++) {
    const particle = new Particle3D(
      (Math.random() - 0.5) * 0.5,
      -2,
      (Math.random() - 0.5) * 0.5
    );
    particles.push(particle);
  }
}

// ===== WINDOW RESIZE =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== ANIMATION LOOP =====
function animate() {
  requestAnimationFrame(animate);

  particleCreationTimer += 16;
  if (particleCreationTimer >= particleCreationInterval) {
    createParticles();
    particleCreationTimer = 0;
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    if (!particle.update()) {
      particle.dispose();
      particles.splice(i, 1);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();