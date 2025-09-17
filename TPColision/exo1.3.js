import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Setup our physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

// Bounds matching the visual ground (100 x 100)
const HALF_SIZE = 25
const GROUND_SIZE = HALF_SIZE * 2
const WALL_THICKNESS = 0.5
const WALL_HEIGHT = 100

// Create multiple cube bodies
const cubeMaterial = new CANNON.Material('cubeMaterial')
const cubeBodies = []
const cubeMeshes = []
const numCubes = 100
const cubeHalfExtents = new CANNON.Vec3(1, 1, 1)
for (let i = 0; i < numCubes; i++) {
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(cubeHalfExtents),
    material: cubeMaterial,
  })
  const px = (Math.random() - 0.5) * (HALF_SIZE * 1.6)
  const pz = (Math.random() - 0.5) * (HALF_SIZE * 1.6)
  body.position.set(px, 5 + Math.random() * 10, pz)
  cubeBodies.push(body)
  world.addBody(body)
}

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

// Materials and contacts
const groundMaterial = new CANNON.Material('groundMaterial')
groundBody.material = groundMaterial
// cube-ground
world.addContactMaterial(new CANNON.ContactMaterial(groundMaterial, cubeMaterial, { restitution: 0.6, friction: 0.3 }))

// Invisible boundary walls using thin boxes (more robust than planes)
const wallMaterial = new CANNON.Material('wallMaterial')
const wallXHalf = new CANNON.Vec3(WALL_THICKNESS, WALL_HEIGHT / 2, HALF_SIZE)
const wallZHalf = new CANNON.Vec3(HALF_SIZE, WALL_HEIGHT / 2, WALL_THICKNESS)

// Left wall (x = -HALF_SIZE)
const leftWallBody = new CANNON.Body({ type: CANNON.Body.STATIC, material: wallMaterial })
leftWallBody.addShape(new CANNON.Box(wallXHalf))
leftWallBody.position.set(-HALF_SIZE - WALL_THICKNESS, WALL_HEIGHT / 2, 0)
world.addBody(leftWallBody)

// Right wall (x = +HALF_SIZE)
const rightWallBody = new CANNON.Body({ type: CANNON.Body.STATIC, material: wallMaterial })
rightWallBody.addShape(new CANNON.Box(wallXHalf))
rightWallBody.position.set(HALF_SIZE + WALL_THICKNESS, WALL_HEIGHT / 2, 0)
world.addBody(rightWallBody)

// Back wall (z = -HALF_SIZE)
const backWallBody = new CANNON.Body({ type: CANNON.Body.STATIC, material: wallMaterial })
backWallBody.addShape(new CANNON.Box(wallZHalf))
backWallBody.position.set(0, WALL_HEIGHT / 2, -HALF_SIZE - WALL_THICKNESS)
world.addBody(backWallBody)

// Front wall (z = +HALF_SIZE)
const frontWallBody = new CANNON.Body({ type: CANNON.Body.STATIC, material: wallMaterial })
frontWallBody.addShape(new CANNON.Box(wallZHalf))
frontWallBody.position.set(0, WALL_HEIGHT / 2, HALF_SIZE + WALL_THICKNESS)
world.addBody(frontWallBody)

// top wall (z = +HALF_SIZE)
const topWallBody = new CANNON.Body({ type: CANNON.Body.STATIC, material: wallMaterial })
topWallBody.addShape(new CANNON.Box(wallZHalf))
topWallBody.position.set(0, WALL_HEIGHT / 2, HALF_SIZE + WALL_THICKNESS)
world.addBody(topWallBody)

// cube-cube and cube-wall bouncy contacts
world.addContactMaterial(new CANNON.ContactMaterial(cubeMaterial, cubeMaterial, { restitution: 0.5, friction: 0.4 }))
world.addContactMaterial(new CANNON.ContactMaterial(cubeMaterial, wallMaterial, { restitution: 0.8, friction: 0.1 }))


// THREE.js scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x202025)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, HALF_SIZE * 1.6, HALF_SIZE * 1.6)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

// lumière
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
dirLight.position.set(5, 10, 5)
scene.add(dirLight)

// sol
const groundGeo = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE)
const groundMat = new THREE.MeshStandardMaterial({ color: 0x224422 })
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
groundMesh.rotation.x = -Math.PI / 2
groundMesh.position.y = 0
groundMesh.receiveShadow = true
scene.add(groundMesh)


const cubeGeo = new THREE.BoxGeometry(2, 2, 2)
for (let i = 0; i < cubeBodies.length; i++) {
  const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.5, 0.6), metalness: 0.1, roughness: 0.7 })
  const mesh = new THREE.Mesh(cubeGeo, mat)
  mesh.castShadow = true
  scene.add(mesh)
  cubeMeshes.push(mesh)
}

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault()
    for (const body of cubeBodies) {
      body.wakeUp()
      body.velocity.y = 7
      body.velocity.x = (Math.random() - 0.5) * 8
      body.velocity.z = (Math.random() - 0.5) * 8
    }
  }
})

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Start the simulation loop
function animate() {
  requestAnimationFrame(animate)

  world.fixedStep()

  // Sync meshes with physics
  for (let i = 0; i < cubeBodies.length; i++) {
    const b = cubeBodies[i]
    const m = cubeMeshes[i]
    m.position.set(b.position.x, b.position.y, b.position.z)
    m.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w)
  }

  controls.update()
  renderer.render(scene, camera)

  // the sphere y position shows the sphere falling
//   console.log(`Sphere y position: ${sphereBody.position.y}`)
}
animate()