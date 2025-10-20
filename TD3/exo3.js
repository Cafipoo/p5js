import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ====== CONFIGURATION DE BASE DE THREE ======
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 6, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ====== LUMIÈRE (peu nécessaire pour Points + BasicMaterial, mais garde la parité) ======
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// ====== SOL (référence) ======
{
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ color: 0x111111 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  scene.add(ground);
}

// ====== TEXTURE : dégradé radial doux pour des points façon fumée ======
function createSoftCircleTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const r = size / 2;
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0.0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.25)');
  gradient.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
const sprite = createSoftCircleTexture(128);

// ====== PARTICULES via Points + BufferGeometry ======
const particleCount = 10000; // tampon de taille fixe selon les consignes
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3); // stocke les vitesses xyz

// initialise les positions (autour d’une petite zone d’émission) et des vitesses orientées vers le haut
for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 0.8; // x
  positions[i3 + 1] = -2 + Math.random() * 0.4;    // y proche du sol
  positions[i3 + 2] = (Math.random() - 0.5) * 0.8; // z

  velocities[i3 + 0] = (Math.random() - 0.5) * 0.02; // légère dérive latérale
  velocities[i3 + 1] = 0.02 + Math.random() * 0.04;  // vers le haut
  velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  map: sprite,
  color: 0xffffff,
  size: 1,
  sizeAttenuation: true,
  alphaTest: 0.0,
  transparent: true,
  opacity: 0.35,
  depthTest: true,
  depthWrite: false,
  blending: THREE.NormalBlending,
  dithering: true
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// ====== ANIMATION ======
const boundsYMin = -2.0;
const boundsYMax = 6.0;
const windX = 0.0001; // vent plus léger vers la droite

function animate() {
  requestAnimationFrame(animate);

  // met à jour les positions des particules sur place
  const pos = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    velocities[i3 + 0] += windX; // ajoute un tout petit vent

    pos[i3 + 0] += velocities[i3 + 0];
    pos[i3 + 1] += velocities[i3 + 1];
    pos[i3 + 2] += velocities[i3 + 2];

    // quand une particule dépasse le maximum, on la recycle près de l’émetteur
    if (pos[i3 + 1] > boundsYMax) {
      pos[i3 + 0] = (Math.random() - 0.5) * 0.8;
      pos[i3 + 1] = boundsYMin + Math.random() * 0.2;
      pos[i3 + 2] = (Math.random() - 0.5) * 0.8;

      velocities[i3 + 0] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = 0.02 + Math.random() * 0.04;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
  }
  geometry.attributes.position.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
}

// ====== LIAISON AVEC L’INTERFACE ======
const opacityInput = document.getElementById("opacity");
const alphaTestInput = document.getElementById("alphaTest");
const sizeInput = document.getElementById("size");
const attenuationInput = document.getElementById("attenuation");
const transparentInput = document.getElementById("transparent");
const depthTestInput = document.getElementById("depthTest");

const opacityValue = document.getElementById("opacityValue");
const alphaTestValue = document.getElementById("alphaTestValue");
const sizeValue = document.getElementById("sizeValue");

function updateMaterialFromUI() {
  material.opacity = parseFloat(opacityInput.value);
  opacityValue.textContent = material.opacity.toFixed(2);

  material.alphaTest = parseFloat(alphaTestInput.value);
  alphaTestValue.textContent = material.alphaTest.toFixed(2);

  material.size = parseFloat(sizeInput.value);
  sizeValue.textContent = String(material.size);

  material.sizeAttenuation = attenuationInput.checked;
  material.transparent = transparentInput.checked;
  material.depthTest = depthTestInput.checked;

  material.needsUpdate = true; // garantit la mise à jour de l’état GL
}

opacityInput.addEventListener("input", updateMaterialFromUI);
alphaTestInput.addEventListener("input", updateMaterialFromUI);
sizeInput.addEventListener("input", updateMaterialFromUI);
attenuationInput.addEventListener("change", updateMaterialFromUI);
transparentInput.addEventListener("change", updateMaterialFromUI);
depthTestInput.addEventListener("change", updateMaterialFromUI);

updateMaterialFromUI();

// ====== REDIMENSIONNEMENT ======
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
