# QCM - Questions de Code et Implémentation

## Question 1 - Création de Scène
Quel code crée correctement une scène Three.js ?
```javascript
// A)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// B)
const scene = new THREE.Scene();
const camera = new THREE.Camera();
const renderer = new THREE.Renderer();

// C)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
```
- A) A ✓
- B) B
- C) C
- D) Aucune

## Question 2 - Création de Cube
Quel code crée un cube rouge ?
```javascript
// A)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// B)
const cube = new THREE.BoxGeometry(1, 1, 1);
cube.material = new THREE.MeshBasicMaterial({ color: 'red' });
scene.add(cube);

// C)
const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(cube);
```
- A) A ✓
- B) B
- C) C ✓
- D) Aucune

## Question 3 - Animation Loop
Quel code crée une boucle d'animation correcte ?
```javascript
// A)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// B)
setInterval(() => {
    renderer.render(scene, camera);
}, 16);

// C)
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
```
- A) A ✓
- B) B
- C) C ✓
- D) Aucune

## Question 4 - Gestion des Événements
Quel code gère correctement le redimensionnement ?
```javascript
// A)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// B)
window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
};

// C)
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});
```
- A) A ✓
- B) B
- C) C
- D) Aucune

## Question 5 - Raycaster
Quel code utilise correctement le Raycaster ?
```javascript
// A)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(objects);

// B)
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(event.clientX, event.clientY, camera);
const intersects = raycaster.intersectObjects(objects);

// C)
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(objects);
```
- A) A ✓
- B) B
- C) C
- D) Aucune

## Question 6 - Chargement de Modèle
Quel code charge correctement un modèle GLTF ?
```javascript
// A)
const loader = new THREE.GLTFLoader();
loader.load('model.gltf', (gltf) => {
    scene.add(gltf.scene);
});

// B)
const loader = new THREE.GLTFLoader();
loader.load('model.gltf', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
});

// C)
const loader = new THREE.GLTFLoader();
loader.load('model.gltf', (gltf) => {
    scene.add(gltf.scene);
}, undefined, (error) => {
    console.error('Error loading model:', error);
});
```
- A) A
- B) B
- C) C ✓
- D) Aucune

## Question 7 - Système de Particules
Quel code crée correctement un système de particules ?
```javascript
// A)
const particles = [];
for (let i = 0; i < 1000; i++) {
    const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    particle.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
    );
    particles.push(particle);
    scene.add(particle);
}

// B)
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(1000 * 3);
for (let i = 0; i < 1000; i++) {
    positions[i * 3] = Math.random() * 10 - 5;
    positions[i * 3 + 1] = Math.random() * 10 - 5;
    positions[i * 3 + 2] = Math.random() * 10 - 5;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0xffffff });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// C)
const particles = new THREE.Points(
    new THREE.SphereGeometry(0.1),
    new THREE.PointsMaterial({ color: 0xffffff })
);
scene.add(particles);
```
- A) A
- B) B ✓
- C) C
- D) Aucune

## Question 8 - Shader Material
Quel code crée correctement un ShaderMaterial ?
```javascript
// A)
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    uniforms: {
        time: { value: 0.0 }
    }
});

// B)
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode
});

// C)
const material = new THREE.ShaderMaterial({
    shader: shaderCode,
    uniforms: {
        time: { value: 0.0 }
    }
});
```
- A) A ✓
- B) B
- C) C
- D) Aucune

## Question 9 - Physique Cannon.js
Quel code crée correctement un monde physique ?
```javascript
// A)
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
});

// B)
const world = new CANNON.World();
world.gravity = new CANNON.Vec3(0, -9.82, 0);

// C)
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
```
- A) A ✓
- B) B
- C) C
- D) Aucune

## Question 10 - Synchronisation Physique
Quel code synchronise correctement un mesh avec un corps physique ?
```javascript
// A)
function animate() {
    requestAnimationFrame(animate);
    world.step(1/60);
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
    renderer.render(scene, camera);
}

// B)
function animate() {
    requestAnimationFrame(animate);
    world.fixedStep();
    mesh.position.set(body.position.x, body.position.y, body.position.z);
    mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
    renderer.render(scene, camera);
}

// C)
function animate() {
    requestAnimationFrame(animate);
    world.step();
    mesh.position = body.position;
    mesh.quaternion = body.quaternion;
    renderer.render(scene, camera);
}
```
- A) A
- B) B ✓
- C) C
- D) Aucune

---

**Réponses :**
1. A, 2. A+C, 3. A+C, 4. A, 5. A, 6. C, 7. B, 8. A, 9. A, 10. B
