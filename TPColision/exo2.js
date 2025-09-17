import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ===== THREE.JS SETUP =====
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(6, 4, 8);
camera.lookAt(0, 1, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.35);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(8, 12, 6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 30;
dirLight.shadow.camera.left = -8;
dirLight.shadow.camera.right = 8;
dirLight.shadow.camera.top = 8;
dirLight.shadow.camera.bottom = -8;
dirLight.shadow.bias = -0.0001;
dirLight.shadow.normalBias = 0.02;
scene.add(dirLight);

// ===== CANNON.JS SETUP =====
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// Broadphase & solver pour stabilité
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
const gs = new CANNON.GSSolver();
gs.iterations = 10;
gs.tolerance = 0.001;
world.solver = new CANNON.SplitSolver(gs);

// Materials
const cylMaterial = new CANNON.Material("cylMaterial");
const ballMaterial = new CANNON.Material("ballMaterial");
const groundMat = new CANNON.Material("groundMat");

// Contacts
world.defaultContactMaterial.friction = 0.4;
world.defaultContactMaterial.restitution = 0.2;

world.addContactMaterial(
  new CANNON.ContactMaterial(cylMaterial, groundMat, {
    friction: 0.5,
    restitution: 0.1,
  })
);
world.addContactMaterial(
  new CANNON.ContactMaterial(cylMaterial, cylMaterial, {
    friction: 0.6,
    restitution: 0.2,
  })
);
world.addContactMaterial(
  new CANNON.ContactMaterial(ballMaterial, cylMaterial, {
    friction: 0.3,
    restitution: 0.4,
  })
);
world.addContactMaterial(
  new CANNON.ContactMaterial(ballMaterial, groundMat, {
    friction: 0.4,
    restitution: 0.3,
  })
);

// ===== GROUND =====
// Physics
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  material: groundMat,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Visual
const groundGeom = new THREE.PlaneGeometry(20, 20);
const groundMatVis = new THREE.MeshLambertMaterial({ color: 0x9aa7a7 });
const groundMesh = new THREE.Mesh(groundGeom, groundMatVis);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// ===== CYLINDERS STACK (3-2-1) =====
const cylinderBodies = [];
const cylinderMeshes = [];

const cylRadius = 0.4;
const cylHeight = 1.0;
const cylSegments = 16;

function createCylinder(x, y, z, color = 0xd35400) {
  // Physics shape - utiliser Box pour des collisions plus précises avec les cylindres
  const shape = new CANNON.Box(
    new CANNON.Vec3(cylRadius, cylHeight / 2, cylRadius)
  );

  const body = new CANNON.Body({ mass: 1, material: cylMaterial });
  body.addShape(shape);
  body.position.set(x, y, z);
  body.linearDamping = 0.01;
  body.angularDamping = 0.05;
  world.addBody(body);
  cylinderBodies.push(body);

  // Visual - garder la forme cylindrique pour l'affichage
  const geo = new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 24);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  scene.add(mesh);
  cylinderMeshes.push(mesh);
}

// Pyramid layout
const baseY = cylHeight / 2;
const dx = 1.0; // horizontal spacing

// Row 1 (bottom): 3
createCylinder(-dx, baseY, 0, 0xe67e22);
createCylinder(0, baseY, 0, 0xf1c40f);
createCylinder(dx, baseY, 0, 0xe74c3c);

// Row 2: 2
createCylinder(-dx / 2, baseY + cylHeight, 0, 0x2ecc71);
createCylinder(dx / 2, baseY + cylHeight, 0, 0x3498db);

// Row 3: 1 (top)
createCylinder(0, baseY + 2 * cylHeight, 0, 0x9b59b6);

// ===== BALL (created on click) =====
const balls = [];
const ballMeshes = [];
const ballRadius = 0.25;

function launchBall(target) {
  // Start just in front of the camera
  const from = new THREE.Vector3();
  camera.getWorldPosition(from);
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const start = from.clone().add(dir.clone().multiplyScalar(1.0));

  // Physics
  const shape = new CANNON.Sphere(ballRadius);
  const body = new CANNON.Body({ mass: 1, shape, material: ballMaterial });
  body.position.set(start.x, start.y, start.z);
  body.linearDamping = 0.01;
  body.angularDamping = 0.05;

  // Velocity towards target
  const v = new THREE.Vector3()
    .subVectors(target, start)
    .normalize()
    .multiplyScalar(18);
  body.velocity.set(v.x, v.y, v.z);
  world.addBody(body);
  balls.push(body);

  // Visual
  const geo = new THREE.SphereGeometry(ballRadius, 24, 16);
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.copy(start);
  scene.add(mesh);
  ballMeshes.push(mesh);
}

// ===== RAYCAST CLICK =====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Créer un plan invisible au niveau du sol pour détecter les clics
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersectionPoint = new THREE.Vector3();

  raycaster.ray.intersectPlane(groundPlane, intersectionPoint);

  if (intersectionPoint) {
    launchBall(intersectionPoint);
  }
}

renderer.domElement.addEventListener("pointerdown", onPointerDown);

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

  // Sync cylinders
  for (let i = 0; i < cylinderBodies.length; i++) {
    cylinderMeshes[i].position.copy(cylinderBodies[i].position);
    cylinderMeshes[i].quaternion.copy(cylinderBodies[i].quaternion);
  }

  // Sync balls
  for (let i = 0; i < balls.length; i++) {
    ballMeshes[i].position.copy(balls[i].position);
    ballMeshes[i].quaternion.copy(balls[i].quaternion);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();