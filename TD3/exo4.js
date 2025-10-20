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
const spriteMap = createSoftCircleTexture(128);

// ====== SPRITES indépendants (matériau par sprite) ======
const spriteCount = 128;
const sprites = new Array(spriteCount);
const spriteVelocities = new Array(spriteCount);

for (let i = 0; i < spriteCount; i++) {
  const material = new THREE.SpriteMaterial({
    map: spriteMap,
    color: 0xb0b0b0,
    alphaTest: 0.0,
    transparent: true,
    opacity: 0.35,
    depthTest: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    dithering: true
  });

  const s = new THREE.Sprite(material);
  s.position.set(
    (Math.random() - 0.5) * 0.8,
    -2 + Math.random() * 0.4,
    (Math.random() - 0.5) * 0.8
  );
  const baseSize = 1.0; // unités du monde
  s.scale.set(baseSize, baseSize, 1);
  scene.add(s);
  sprites[i] = s;

  spriteVelocities[i] = new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    0.02 + Math.random() * 0.04,
    (Math.random() - 0.5) * 0.02
  );
}

// ====== ANIMATION ======
const boundsYMin = -2.0;
const boundsYMax = 6.0;
const windX = 0.0000; // vent léger vers la droite

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < spriteCount; i++) {
    const s = sprites[i];
    const v = spriteVelocities[i];

    v.x += windX;
    s.position.x += v.x;
    s.position.y += v.y;
    s.position.z += v.z;

    if (s.position.y > boundsYMax) {
      s.position.set(
        (Math.random() - 0.5) * 0.8,
        boundsYMin + Math.random() * 0.2,
        (Math.random() - 0.5) * 0.8
      );
      v.set(
        (Math.random() - 0.5) * 0.02,
        0.02 + Math.random() * 0.04,
        (Math.random() - 0.5) * 0.02
      );
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

// ====== LIAISON AVEC L’INTERFACE (appliquer à tous les sprites) ======
const opacityInput = document.getElementById("opacity");
const alphaTestInput = document.getElementById("alphaTest");
const sizeInput = document.getElementById("size");
const transparentInput = document.getElementById("transparent");
const depthTestInput = document.getElementById("depthTest");

const opacityValue = document.getElementById("opacityValue");
const alphaTestValue = document.getElementById("alphaTestValue");
const sizeValue = document.getElementById("sizeValue");

function applyUIToAllSprites() {
  const opacity = parseFloat(opacityInput.value);
  const alphaTest = parseFloat(alphaTestInput.value);
  const sizeWorld = parseFloat(sizeInput.value);
  const isTransparent = transparentInput.checked;
  const isDepthTest = depthTestInput.checked;

  opacityValue.textContent = opacity.toFixed(2);
  alphaTestValue.textContent = alphaTest.toFixed(2);
  sizeValue.textContent = sizeWorld.toFixed(2);

  for (let i = 0; i < spriteCount; i++) {
    const s = sprites[i];
    const mat = s.material;
    mat.opacity = opacity;
    mat.alphaTest = alphaTest;
    mat.transparent = isTransparent;
    mat.depthTest = isDepthTest;
    mat.needsUpdate = true;
    s.scale.set(sizeWorld, sizeWorld, 1);
  }
}

opacityInput.addEventListener("input", applyUIToAllSprites);
alphaTestInput.addEventListener("input", applyUIToAllSprites);
sizeInput.addEventListener("input", applyUIToAllSprites);
transparentInput.addEventListener("change", applyUIToAllSprites);
depthTestInput.addEventListener("change", applyUIToAllSprites);

// initialise l'état UI → tous
applyUIToAllSprites();

// ====== REDIMENSIONNEMENT ======
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
