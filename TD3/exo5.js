import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/*
  TD3 - Exercice 5
  Fumée via sprites animés (cycle d'une série d'images), avec Raycaster pour
  déplacer l'émetteur selon l'intersection souris ↔ plan horizontal (y = -2),
  scene/camera/controls dans l'esprit de l'exercice 4.
*/

// --- Paramètres ---
const NUM_PARTICLES = 1000;            // plus de sprites pour un volume de fumée plus dense
const IMAGE_COUNT = 91;               // nombre d'images disponibles
const IMAGE_PATH = './assets/';       // dossier des images, ex: TD3/assets/0000.png ...
const IMAGE_PAD = 4;                  // padStart pour les noms de fichiers
const WORLD_SIZE = 2.2;               // zone d'émission compacte autour de l'émetteur
const SPRITE_SIZE = 1.6;              // taille des sprites (unités monde, cohérent avec exo4)
const FRAME_RATE = 30;                // images/s pour la progression des maps
const BASE_OPACITY = 0.10;            // opacité de base plus faible pour un rendu plus léger

// ====== CONFIGURATION DE BASE DE THREE (style Exo 4) ======
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lumière (faible)
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// Sol y = -2 (référence et cible du Raycaster)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ color: 0x111111 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
ground.name = 'ground';
scene.add(ground);

// Émetteur (sans anneau visuel)
const emitter = new THREE.Object3D();
scene.add(emitter);

// --- Chargement des maps ---
const loader = new THREE.TextureLoader();
loader.crossOrigin = 'anonymous';
const maps = [];

for (let i = 0; i < IMAGE_COUNT; i++) {
  const file = IMAGE_PATH + String(i).padStart(IMAGE_PAD, '0') + '.png';
  const tex = loader.load(file);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  maps.push(tex);
}

// --- Particules (sprites) ---
const sprites = [];

function createSmokeSprite() {
  const startIndex = Math.floor(Math.random() * IMAGE_COUNT);
  const mat = new THREE.SpriteMaterial({
    map: maps[startIndex],
    color: 0xffffff,
    opacity: BASE_OPACITY,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const s = new THREE.Sprite(mat);
  s.scale.set(SPRITE_SIZE, SPRITE_SIZE, 1);
  s.position.set(
    emitter.position.x + (Math.random() - 0.5) * WORLD_SIZE,
    -2 + 0.05,
    emitter.position.z + (Math.random() - 0.5) * WORLD_SIZE
  );
  s.userData = {
    frame: startIndex,
    speed: 1 + Math.random() * 1.5,
    life: 0,
    lifeMax: 3.0 + Math.random() * 3.0,
    startScale: s.scale.x,
  };
  scene.add(s);
  return s;
}

for (let i = 0; i < NUM_PARTICLES; i++) {
  sprites.push(createSmokeSprite());
}

// --- Raycaster souris → plan ---
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();

function setMouseFromEvent(e) {
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  mouseNDC.x = (x / window.innerWidth) * 2 - 1;
  mouseNDC.y = -(y / window.innerHeight) * 2 + 1;
}

function updateEmitterFromMouse() {
  raycaster.setFromCamera(mouseNDC, camera);
  const hit = raycaster.intersectObject(ground, false);
  if (hit.length > 0) {
    emitter.position.copy(hit[0].point);
  }
}

window.addEventListener('mousemove', (e) => { setMouseFromEvent(e); updateEmitterFromMouse(); }, { passive: true });
window.addEventListener('touchstart', (e) => { setMouseFromEvent(e); updateEmitterFromMouse(); }, { passive: true });
window.addEventListener('touchmove', (e) => { setMouseFromEvent(e); updateEmitterFromMouse(); }, { passive: true });

// --- Animation ---
let lastTime = performance.now();
let accumulator = 0;
const frameInterval = 1 / FRAME_RATE;

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  accumulator += dt;

  // Avance des frames des sprites à cadence fixe
  while (accumulator >= frameInterval) {
    for (let i = 0; i < sprites.length; i++) {
      const sp = sprites[i];
      const ud = sp.userData;

      // progression dans la série d'images
      ud.frame = (ud.frame + ud.speed) % IMAGE_COUNT;
      const frameIndex = Math.floor(ud.frame) % IMAGE_COUNT;
      const nextMap = maps[frameIndex];
      if (sp.material.map !== nextMap) {
        sp.material.map = nextMap;
        sp.material.mapNeedsUpdate = true;
      }

      // dynamique de fumée: monte et s'étale (réglage à l'échelle Exo 4)
      sp.position.y += 0.012 + 0.012 * ud.speed; // monte un peu plus vite
      const growth = 1 + 0.0022 * ud.speed;      // croissance un peu plus forte
      const newScale = Math.min(ud.startScale * 2.4, sp.scale.x * growth);
      sp.scale.set(newScale, newScale, 1);

      ud.life += frameInterval;
      // attenuation progressive
      const alpha = Math.max(0, 1 - ud.life / ud.lifeMax);
      sp.material.opacity = BASE_OPACITY * alpha;

      // réinitialisation lorsque la vie est finie
      if (ud.life >= ud.lifeMax) {
        const rs = 0.9 + Math.random() * 1.0;
        sp.position.set(
          emitter.position.x + (Math.random() - 0.5) * WORLD_SIZE,
          -2 + 0.05,
          emitter.position.z + (Math.random() - 0.5) * WORLD_SIZE
        );
        ud.frame = Math.random() * IMAGE_COUNT;
        ud.speed = 1 + Math.random() * 1.5;
        ud.life = 0;
        ud.lifeMax = 2.5 + Math.random() * 2.5;
        sp.material.opacity = BASE_OPACITY;
        sp.scale.set(SPRITE_SIZE * rs, SPRITE_SIZE * rs, 1);
        ud.startScale = sp.scale.x;
      }
    }
    accumulator -= frameInterval;
  }

  controls.update();
  renderer.render(scene, camera);
}

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Position initiale de l'émetteur (centre du ground)
emitter.position.set(0, -2, 0);
requestAnimationFrame(animate);


