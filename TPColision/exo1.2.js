import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Setup our physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

// Bounds matching the visual ground (100 x 100)
const HALF_SIZE = 50
const WALL_THICKNESS = 0.5
const WALL_HEIGHT = 10

// Create a sphere body
const radius = 1 // m
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
})
// Ensure spawn inside bounds
const clampedX = Math.max(-HALF_SIZE + radius, Math.min(HALF_SIZE - radius, 0))
const clampedZ = Math.max(-HALF_SIZE + radius, Math.min(HALF_SIZE - radius, 0))
sphereBody.position.set(clampedX, 10, clampedZ) // m
world.addBody(sphereBody)

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

// Invisible boundary walls using thin boxes (more robust than planes)
const wallMaterial = new CANNON.Material()
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


// THREE.js scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x202025)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(6, 6, 10)

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
const groundGeo = new THREE.PlaneGeometry(100, 100)
const groundMat = new THREE.MeshStandardMaterial({ color: 0x224422 })
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
groundMesh.rotation.x = -Math.PI / 2
groundMesh.position.y = 0
groundMesh.receiveShadow = true
scene.add(groundMesh)


const sphereGeo = new THREE.BoxGeometry(1, 1, 1)
const sphereMat = new THREE.MeshStandardMaterial({ color: 0x3399ff, metalness: 0.1, roughness: 0.7 })
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
sphereMesh.castShadow = true
scene.add(sphereMesh)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault()
    sphereBody.wakeUp()
    sphereBody.velocity.y = 7
    sphereBody.velocity.x = (Math.random() - 0.5) * 10
    sphereBody.velocity.z = (Math.random() - 0.5) * 10
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

  // Sync mesh with physics
  sphereMesh.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z)
  sphereMesh.quaternion.set(
    sphereBody.quaternion.x,
    sphereBody.quaternion.y,
    sphereBody.quaternion.z,
    sphereBody.quaternion.w
  )

  controls.update()
  renderer.render(scene, camera)

  // the sphere y position shows the sphere falling
//   console.log(`Sphere y position: ${sphereBody.position.y}`)
}
animate()