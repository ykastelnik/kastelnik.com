<template>
  <div ref="containerRef" class="threejs-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Template ref for the container element
const containerRef = ref(null)

// Three.js core objects
let scene, camera, renderer, controls, animationId

// Room dimensions
const ROOM_SIZE = 10

onMounted(() => {
  initScene()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // Clean up resources
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (controls) {
    controls.dispose()
  }
  if (renderer) {
    renderer.dispose()
  }
})

/**
 * Initialize the Three.js scene, camera, renderer, and objects
 */
function initScene() {
  // === SCENE SETUP ===
  // Create the scene with a bright sky background (visible through the window)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB) // Bright sky blue (Thomas the Train countryside)

  // === CAMERA SETUP ===
  // Use OrthographicCamera for isometric view
  // Calculate aspect ratio
  const aspect = window.innerWidth / window.innerHeight
  const frustumSize = 15 // Controls the zoom level

  camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,  // left
    frustumSize * aspect / 2,   // right
    frustumSize / 2,            // top
    frustumSize / -2,           // bottom
    0.1,                        // near
    1000                        // far
  )

  // Position camera for isometric view (looking from top-right corner)
  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)

  // === RENDERER SETUP ===
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true // Enable shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  containerRef.value.appendChild(renderer.domElement)

  // === ORBIT CONTROLS ===
  // Enable interactive camera movement (rotate, pan, zoom)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // Smooth camera movements
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 5 // Minimum zoom distance
  controls.maxDistance = 50 // Maximum zoom distance
  controls.maxPolarAngle = Math.PI / 2 // Prevent camera going below ground

  // === LIGHTING ===
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // Directional light positioned above for soft shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true

  // Configure shadow properties
  directionalLight.shadow.camera.left = -15
  directionalLight.shadow.camera.right = 15
  directionalLight.shadow.camera.top = 15
  directionalLight.shadow.camera.bottom = -15
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048

  scene.add(directionalLight)

  // === ROOM CONSTRUCTION ===
  createRoom()
}

/**
 * Create procedural brick texture for Thomas the Train's shed
 */
function createBrickTexture(brickColor, mortarColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Fill with mortar color
  ctx.fillStyle = mortarColor
  ctx.fillRect(0, 0, 512, 512)

  // Draw bricks
  ctx.fillStyle = brickColor
  const brickWidth = 100
  const brickHeight = 40
  const mortarWidth = 4

  for (let y = 0; y < 512; y += brickHeight + mortarWidth) {
    for (let x = 0; x < 512; x += brickWidth + mortarWidth) {
      const offset = (Math.floor(y / (brickHeight + mortarWidth)) % 2) * (brickWidth / 2)
      ctx.fillRect(x + offset, y, brickWidth, brickHeight)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

/**
 * Create the room: floor and two adjacent walls with a window (Thomas the Train shed theme)
 */
function createRoom() {
  // --- FLOOR ---
  // Concrete floor with railway gray color
  const floorGeometry = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE)
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0x808080, // Railway gray
    side: THREE.DoubleSide
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2 // Rotate to be horizontal
  floor.position.y = 0
  floor.receiveShadow = true
  scene.add(floor)

  // --- RAILWAY TRACKS ---
  // Add railway tracks on the floor for Thomas the Train theme
  const railMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A }) // Dark gray rails
  const sleeperlMaterial = new THREE.MeshLambertMaterial({ color: 0x5C4033 }) // Brown sleepers (ties)

  // Rails (two parallel rails)
  const railGeometry = new THREE.BoxGeometry(0.15, 0.1, ROOM_SIZE)
  const rail1 = new THREE.Mesh(railGeometry, railMaterial)
  rail1.position.set(-0.7, 0.05, 0)
  scene.add(rail1)

  const rail2 = new THREE.Mesh(railGeometry, railMaterial)
  rail2.position.set(0.7, 0.05, 0)
  scene.add(rail2)

  // Sleepers (cross ties)
  const sleeperGeometry = new THREE.BoxGeometry(2, 0.08, 0.2)
  for (let i = -ROOM_SIZE / 2; i < ROOM_SIZE / 2; i += 0.8) {
    const sleeper = new THREE.Mesh(sleeperGeometry, sleeperlMaterial)
    sleeper.position.set(0, 0.04, i)
    scene.add(sleeper)
  }

  // --- WALL 1 (Thomas Blue Brick Wall) ---
  // Position: back wall (along Z-axis) - Thomas the Tank Engine blue
  const wall1Geometry = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE)
  const thomasBlueBrickTexture = createBrickTexture('#0066B3', '#C0C0C0') // Thomas blue with gray mortar
  const wall1Material = new THREE.MeshLambertMaterial({
    map: thomasBlueBrickTexture,
    side: THREE.DoubleSide
  })
  const wall1 = new THREE.Mesh(wall1Geometry, wall1Material)
  wall1.position.set(0, ROOM_SIZE / 2, -ROOM_SIZE / 2)
  wall1.receiveShadow = true
  wall1.castShadow = true
  scene.add(wall1)

  // --- WALL 2 (Red Brick Wall) with Window ---
  // Position: left wall (along X-axis) - Classic railway shed red brick
  // We'll create this wall using Shape geometry to cut out a window
  const wallShape = new THREE.Shape()

  // Create the outer rectangle (full wall)
  wallShape.moveTo(-ROOM_SIZE / 2, 0)
  wallShape.lineTo(ROOM_SIZE / 2, 0)
  wallShape.lineTo(ROOM_SIZE / 2, ROOM_SIZE)
  wallShape.lineTo(-ROOM_SIZE / 2, ROOM_SIZE)
  wallShape.lineTo(-ROOM_SIZE / 2, 0)

  // Create the window hole (inner rectangle)
  const windowWidth = 3
  const windowHeight = 4
  const windowX = 1 // Offset from center
  const windowY = 3 // Height from floor

  const windowHole = new THREE.Path()
  windowHole.moveTo(windowX - windowWidth / 2, windowY - windowHeight / 2)
  windowHole.lineTo(windowX + windowWidth / 2, windowY - windowHeight / 2)
  windowHole.lineTo(windowX + windowWidth / 2, windowY + windowHeight / 2)
  windowHole.lineTo(windowX - windowWidth / 2, windowY + windowHeight / 2)
  windowHole.lineTo(windowX - windowWidth / 2, windowY - windowHeight / 2)

  wallShape.holes.push(windowHole)

  // Create geometry from the shape
  const wall2Geometry = new THREE.ShapeGeometry(wallShape)
  const redBrickTexture = createBrickTexture('#8B3A3A', '#D3D3D3') // Railway red brick with light gray mortar
  const wall2Material = new THREE.MeshLambertMaterial({
    map: redBrickTexture,
    side: THREE.DoubleSide
  })
  const wall2 = new THREE.Mesh(wall2Geometry, wall2Material)
  wall2.rotation.y = Math.PI / 2 // Rotate to face inward
  wall2.position.set(-ROOM_SIZE / 2, 0, 0)
  wall2.receiveShadow = true
  wall2.castShadow = true
  scene.add(wall2)

  // --- WINDOW FRAME (Optional decorative element) ---
  // Add a simple frame around the window for visual appeal
  const frameMaterial = new THREE.MeshLambertMaterial({
    color: 0x8B4513, // Brown color for frame
    side: THREE.DoubleSide
  })
  const frameThickness = 0.15

  // Top frame bar
  const topFrameGeometry = new THREE.BoxGeometry(windowWidth + frameThickness * 2, frameThickness, 0.1)
  const topFrame = new THREE.Mesh(topFrameGeometry, frameMaterial)
  topFrame.position.set(
    -ROOM_SIZE / 2 - 0.05,
    windowY + windowHeight / 2,
    windowX
  )
  scene.add(topFrame)

  // Bottom frame bar
  const bottomFrame = new THREE.Mesh(topFrameGeometry, frameMaterial)
  bottomFrame.position.set(
    -ROOM_SIZE / 2 - 0.05,
    windowY - windowHeight / 2,
    windowX
  )
  scene.add(bottomFrame)

  // Left frame bar
  const sideFrameGeometry = new THREE.BoxGeometry(frameThickness, windowHeight, 0.1)
  const leftFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial)
  leftFrame.position.set(
    -ROOM_SIZE / 2 - 0.05,
    windowY,
    windowX - windowWidth / 2
  )
  scene.add(leftFrame)

  // Right frame bar
  const rightFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial)
  rightFrame.position.set(
    -ROOM_SIZE / 2 - 0.05,
    windowY,
    windowX + windowWidth / 2
  )
  scene.add(rightFrame)
}

/**
 * Animation loop - renders the scene continuously
 */
function animate() {
  animationId = requestAnimationFrame(animate)

  // Update controls for smooth damping effect
  if (controls) {
    controls.update()
  }

  renderer.render(scene, camera)
}

/**
 * Handle window resize events
 */
function handleResize() {
  const aspect = window.innerWidth / window.innerHeight
  const frustumSize = 15

  // Update camera projection
  camera.left = frustumSize * aspect / -2
  camera.right = frustumSize * aspect / 2
  camera.top = frustumSize / 2
  camera.bottom = frustumSize / -2
  camera.updateProjectionMatrix()

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}
</script>

<style scoped>
.threejs-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
