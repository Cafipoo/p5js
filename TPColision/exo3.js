import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// ===== THREE.JS SETUP =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdedede);

// Camera - top view
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 18, 0.01);
camera.up.set(0, 0, -1); // keep north up for consistent orbit
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2; // lock to top view
controls.target.set(0, 0, 0);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(6, 12, 6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

// ===== CANNON.JS SETUP =====
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
const gs = new CANNON.GSSolver();
gs.iterations = 10;
gs.tolerance = 0.001;
world.solver = new CANNON.SplitSolver(gs);

// Materials
const groundMat = new CANNON.Material("groundMat");
const letterMat = new CANNON.Material("letterMat");
world.defaultContactMaterial.friction = 0.6;
world.defaultContactMaterial.restitution = 0.2;
world.addContactMaterial(
  new CANNON.ContactMaterial(groundMat, letterMat, {
    friction: 0.8,
    restitution: 0.05, // très peu de rebond
  })
);

// ===== GROUND =====
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  material: groundMat,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 20),
  new THREE.MeshLambertMaterial({ color: 0xe5e5e5 })
);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// ===== LETTERS =====
const word = "BONJOUR"; // à plat au sol
const lettersMeshes = [];
const lettersBodies = [];
const constraints = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Orientation (légère) vers la voisine
const baseInwardTilt = 0.22; // radians
const yawKp = 3.0; // raideur du ressort d'orientation
const yawKd = 0.8; // amortissement

async function createLetters() {
  const fontLoader = new FontLoader();
  const font = await fontLoader.loadAsync(
    "https://unpkg.com/three@0.154.0/examples/fonts/helvetiker_regular.typeface.json"
  );

  const baseColor = 0x6be36b;
  const material = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.6,
    metalness: 0.05,
  });

  const size = 1.7; // lettres plus larges
  const height = 0.5; // un peu plus épaisses
  const bevelSize = 0.05;
  const bevelThickness = 0.07;
  const letterSpacing = 0.015; // quasiment collées

  // Mesurer les largeurs pour centrer l'ensemble
  const widths = [];
  let totalWidth = 0;
  for (let i = 0; i < word.length; i++) {
    const geo = new TextGeometry(word[i], {
      font,
      size,
      height,
      curveSegments: 8,
      bevelEnabled: true,
      bevelSize,
      bevelThickness,
    });
    geo.computeBoundingBox();
    const w = geo.boundingBox.max.x - geo.boundingBox.min.x;
    widths.push(w);
    totalWidth += w + letterSpacing;
  }
  totalWidth -= letterSpacing; // pas d'espacement après la dernière lettre

  let cursor = -totalWidth / 2;

  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    const geometry = new TextGeometry(char, {
      font,
      size,
      height,
      curveSegments: 8,
      bevelEnabled: true,
      bevelSize,
      bevelThickness,
    });

    geometry.center(); // centre autour de l'origine pour simplifier la Box3

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // À plat sur le sol (XZ), épaisseur le long de Y
    mesh.rotation.x = -Math.PI / 2;

    // Positionner selon la largeur calculée
    const w = widths[i];
    const posX = cursor + w / 2;
    const posY = height / 2 + 0.01;
    const posZ = 0;
    mesh.position.set(posX, posY, posZ);
    mesh.userData.index = i;
    scene.add(mesh);
    lettersMeshes.push(mesh);

    // Calculer la boîte englobante après rotation et translation
    const box = new THREE.Box3().setFromObject(mesh);
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);

    // Corps physique approximé par une Box
    const halfExtents = new CANNON.Vec3(
      sizeVec.x / 2,
      sizeVec.y / 2,
      sizeVec.z / 2
    );
    const shape = new CANNON.Box(halfExtents);
    const body = new CANNON.Body({ mass: 1, material: letterMat });
    body.addShape(shape);
    body.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    body.quaternion.set(
      mesh.quaternion.x,
      mesh.quaternion.y,
      mesh.quaternion.z,
      mesh.quaternion.w
    );
    body.linearDamping = 0.2; // freiner mouvements parasites
    body.angularDamping = 0.6; // amortir la rotation
    // Bloquer X et Z (translation), autoriser uniquement Y; bloquer toute rotation
    body.velocity.set(0, 0, 0);
    body.angularVelocity.set(0, 0, 0);
    body.linearFactor = new CANNON.Vec3(0, 1, 0); // uniquement axe Y
    body.angularFactor = new CANNON.Vec3(0, 1, 0); // autoriser légère rotation Y
    world.addBody(body);
    lettersBodies.push(body);

    cursor += w + letterSpacing;
  }

  // Contraintes (chaînage des lettres)
  for (let i = 1; i < lettersBodies.length; i++) {
    const previous = lettersBodies[i - 1];
    const textBody = lettersBodies[i];

    // 1) DistanceConstraint très raide pour rester collées
    const restDistance = Math.abs(textBody.position.x - previous.position.x);
    const dist = new CANNON.DistanceConstraint(previous, textBody, restDistance, 1e6);
    world.addConstraint(dist);
    constraints.push(dist);

    // 2) Hinge en Y pour permettre un léger pivot (vague) sans s'écarter
    const hinge = new CANNON.HingeConstraint(previous, textBody, {
      pivotA: new CANNON.Vec3(
        textBody.position.x - previous.position.x,
        0,
        0
      ),
      pivotB: new CANNON.Vec3(0, 0, 0),
      axisA: new CANNON.Vec3(0, 1, 0),
      axisB: new CANNON.Vec3(0, 1, 0),
    });
    hinge.collideConnected = false;
    world.addConstraint(hinge);
    constraints.push(hinge);
  }
}

// ===== INTERACTION =====
function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(lettersMeshes, false);
  if (intersects && intersects.length > 0) {
    const mesh = intersects[0].object;
    const index = mesh.userData.index ?? lettersMeshes.indexOf(mesh);
    triggerWave(index);
  }
}
renderer.domElement.addEventListener("pointerdown", onPointerDown);

function triggerWave(centerIndex) {
  const baseImpulse = 4.5; // saut plus modéré
  const neighborImpulse = 3.2; // voisines plus douces
  const delayPerLetterMs = 70;

  for (let i = 0; i < lettersBodies.length; i++) {
    const distance = Math.abs(i - centerIndex);
    const delay = distance * delayPerLetterMs;
    const attenuation = Math.exp(-distance / 2);

    setTimeout(() => {
      const body = lettersBodies[i];
      const strength = i === centerIndex ? baseImpulse : neighborImpulse * attenuation;

      // Impulsion verticale (saut)
      body.applyImpulse(new CANNON.Vec3(0, strength, 0), body.position);

      // Pas d'impulsion latérale: elles restent ancrées en X/Z
    }, delay);
  }
}

// ===== RESIZE =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);
  world.fixedStep();

  // Sync letters & garder-les serrées visuellement
  for (let i = 0; i < lettersBodies.length; i++) {
    const body = lettersBodies[i];
    const mesh = lettersMeshes[i];
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);

    // Attirer doucement les lettres voisines pour qu'elles restent presque collées
    if (i > 0) {
      const prev = lettersBodies[i - 1];
      const dx = body.position.x - prev.position.x;
      const desired = (mesh.geometry.boundingBox?.max.x || 0.5) * 0.6; // petite distance
      const error = dx - desired;
      const k = 2.0; // raideur douce
      const fx = -k * error;
      // Appliquer une force opposée en X (même si linearFactor X=0, cela agit via contraintes)
      body.applyForce(new CANNON.Vec3(fx, 0, 0), body.position);
      prev.applyForce(new CANNON.Vec3(-fx, 0, 0), prev.position);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

(async function init() {
  await createLetters();
  animate();
})();


