<template>
  <div ref="containerRef" class="threejs-container">
    <!-- Help Overlay -->
    <div class="help-overlay" v-if="showHelp">
      <div class="help-content">
        <h2>🚂 Thomas Train Dashboard Controls 🎄</h2>
        <div class="help-section">
          <h3>Camera Controls:</h3>
          <p><strong>Mouse Left + Drag:</strong> Rotate camera 360°</p>
          <p><strong>Mouse Right + Drag:</strong> Pan view</p>
          <p><strong>Mouse Wheel:</strong> Zoom in/out</p>
        </div>
        <div class="help-section">
          <h3>Keyboard Controls:</h3>
          <p><strong>Arrow Keys / WASD:</strong> Move camera</p>
          <p><strong>Q / E:</strong> Rotate left/right</p>
          <p><strong>R:</strong> Reset camera position</p>
          <p><strong>H:</strong> Toggle this help</p>
        </div>
        <button @click="showHelp = false" class="close-btn">Close (H)</button>
      </div>
    </div>

    <!-- Train Dashboard -->
    <div class="train-dashboard">
      <div class="dashboard-title">🚂 Thomas Control Panel 🎄</div>
      <div class="dashboard-controls">
        <div class="control-group">
          <label>Speed:</label>
          <input type="range" v-model="moveSpeed" min="0.1" max="2" step="0.1" />
          <span>{{ moveSpeed }}</span>
        </div>
        <div class="control-group">
          <label>Zoom Level:</label>
          <span>{{ currentZoom.toFixed(1) }}</span>
        </div>
        <div class="control-group">
          <label>Music:</label>
          <button @click="toggleMusic" class="btn-music">
            {{ isMusicPlaying ? '🔊 Pause' : '🔇 Play' }}
          </button>
        </div>
        <div class="control-group">
          <label>Volume:</label>
          <input type="range" v-model="musicVolume" min="0" max="100" step="1" @input="updateVolume" />
          <span>{{ musicVolume }}%</span>
        </div>
        <div class="control-buttons">
          <button @click="resetCamera" class="btn-reset">🔄 Reset View</button>
          <button @click="showHelp = !showHelp" class="btn-help">❓ Help</button>
        </div>
      </div>
    </div>

    <!-- Audio Elements -->
    <audio ref="christmasMusic" loop>
      <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Template ref for the container element
const containerRef = ref(null)
const christmasMusic = ref(null)

// UI reactive variables
const showHelp = ref(true) // Show help on start
const moveSpeed = ref(0.5)
const currentZoom = ref(15)
const isMusicPlaying = ref(false)
const musicVolume = ref(50)

// Three.js core objects
let scene, camera, renderer, controls, animationId

// Animation objects
let snowflakes = []
let train = null
let trainPosition = -ROOM_SIZE / 2 // Start position off-screen
let smokeParticles = []
let audioContext = null
let hasPlayedBell = false

// Room dimensions
const ROOM_SIZE = 10

// Keyboard controls
const keys = {
  w: false, a: false, s: false, d: false,
  arrowup: false, arrowdown: false, arrowleft: false, arrowright: false,
  q: false, e: false
}

// Initial camera position
const initialCameraPosition = { x: 10, y: 10, z: 10 }

onMounted(() => {
  initScene()
  animate()
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  // Initialize audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)()

  // Set initial volume
  if (christmasMusic.value) {
    christmasMusic.value.volume = musicVolume.value / 100
  }
})

onUnmounted(() => {
  // Clean up resources
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (controls) {
    controls.dispose()
  }
  if (renderer) {
    renderer.dispose()
  }
  // Stop music and close audio context
  if (christmasMusic.value) {
    christmasMusic.value.pause()
  }
  if (audioContext) {
    audioContext.close()
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
  // Enable interactive camera movement (rotate, pan, zoom) - Full 360° freedom
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // Smooth camera movements
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = true // Allow free panning
  controls.minDistance = 2 // Minimum zoom distance (closer)
  controls.maxDistance = 80 // Maximum zoom distance (farther)
  // No polar angle restriction - full 360° rotation!
  controls.enablePan = true
  controls.panSpeed = 1.0
  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2

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

  // === CHRISTMAS GARDEN ===
  createChristmasGarden()

  // === THOMAS TRAIN ===
  createThomasTrain()
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
  const windowX = 0 // Centered on wall
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
  const frameDepth = 0.1 // Depth perpendicular to wall

  // Top frame bar (horizontal, extends in Z direction)
  const topFrameGeometry = new THREE.BoxGeometry(
    frameDepth,
    frameThickness,
    windowWidth + frameThickness * 2
  )
  const topFrame = new THREE.Mesh(topFrameGeometry, frameMaterial)
  topFrame.position.set(
    -ROOM_SIZE / 2 - frameDepth / 2, // Slightly in front of wall
    windowY + windowHeight / 2 + frameThickness / 2, // Top edge of window
    windowX // Center of window in Z
  )
  scene.add(topFrame)

  // Bottom frame bar (horizontal, extends in Z direction)
  const bottomFrame = new THREE.Mesh(topFrameGeometry, frameMaterial)
  bottomFrame.position.set(
    -ROOM_SIZE / 2 - frameDepth / 2,
    windowY - windowHeight / 2 - frameThickness / 2, // Bottom edge of window
    windowX
  )
  scene.add(bottomFrame)

  // Left frame bar (vertical, extends in Y direction)
  const sideFrameGeometry = new THREE.BoxGeometry(
    frameDepth,
    windowHeight + frameThickness * 2,
    frameThickness
  )
  const leftFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial)
  leftFrame.position.set(
    -ROOM_SIZE / 2 - frameDepth / 2,
    windowY, // Center of window in Y
    windowX - windowWidth / 2 - frameThickness / 2 // Left edge of window
  )
  scene.add(leftFrame)

  // Right frame bar (vertical, extends in Y direction)
  const rightFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial)
  rightFrame.position.set(
    -ROOM_SIZE / 2 - frameDepth / 2,
    windowY,
    windowX + windowWidth / 2 + frameThickness / 2 // Right edge of window
  )
  scene.add(rightFrame)

  // --- COFFEE TABLE WITH FLOWER POT ---
  // Position in the corner formed by the two walls
  createCoffeeTableWithFlower()
}

/**
 * Create a coffee table with a flower pot in the corner
 */
function createCoffeeTableWithFlower() {
  const cornerX = -ROOM_SIZE / 2 + 1.5 // Near the red brick wall
  const cornerZ = -ROOM_SIZE / 2 + 1.5 // Near the blue wall

  // --- COFFEE TABLE ---
  // Table top
  const tableTopGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.8)
  const tableTopMaterial = new THREE.MeshLambertMaterial({
    color: 0x8B4513 // Brown wood color
  })
  const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial)
  tableTop.position.set(cornerX, 0.5, cornerZ) // Table height: 0.5 units
  tableTop.castShadow = true
  tableTop.receiveShadow = true
  scene.add(tableTop)

  // Table legs (4 legs at corners)
  const legGeometry = new THREE.BoxGeometry(0.08, 0.5, 0.08)
  const legMaterial = new THREE.MeshLambertMaterial({
    color: 0x654321 // Darker brown for legs
  })

  const legPositions = [
    [-0.5, -0.35], // Front left
    [0.5, -0.35],  // Front right
    [-0.5, 0.35],  // Back left
    [0.5, 0.35]    // Back right
  ]

  legPositions.forEach(([offsetX, offsetZ]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(
      cornerX + offsetX,
      0.25, // Half the leg height
      cornerZ + offsetZ
    )
    leg.castShadow = true
    scene.add(leg)
  })

  // --- FLOWER POT ---
  // Pot body (cylinder tapering slightly)
  const potGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.25, 16)
  const potMaterial = new THREE.MeshLambertMaterial({
    color: 0xD2691E // Terracotta color
  })
  const pot = new THREE.Mesh(potGeometry, potMaterial)
  pot.position.set(cornerX, 0.675, cornerZ) // On top of table (0.5 + 0.05 + 0.125)
  pot.castShadow = true
  pot.receiveShadow = true
  scene.add(pot)

  // Soil in pot
  const soilGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16)
  const soilMaterial = new THREE.MeshLambertMaterial({
    color: 0x3E2723 // Dark brown soil
  })
  const soil = new THREE.Mesh(soilGeometry, soilMaterial)
  soil.position.set(cornerX, 0.775, cornerZ) // Top of pot
  scene.add(soil)

  // --- FLOWER/PLANT ---
  // Stem
  const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8)
  const stemMaterial = new THREE.MeshLambertMaterial({
    color: 0x228B22 // Forest green
  })
  const stem = new THREE.Mesh(stemGeometry, stemMaterial)
  stem.position.set(cornerX, 1.0, cornerZ) // Growing from soil
  scene.add(stem)

  // Flower petals (5 petals arranged in a circle)
  const petalGeometry = new THREE.SphereGeometry(0.08, 8, 8)
  const petalMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF69B4 // Hot pink
  })

  const petalCount = 5
  const petalRadius = 0.1

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2
    const petal = new THREE.Mesh(petalGeometry, petalMaterial)
    petal.position.set(
      cornerX + Math.cos(angle) * petalRadius,
      1.2,
      cornerZ + Math.sin(angle) * petalRadius
    )
    petal.scale.set(0.8, 0.5, 0.8) // Flatten petals
    scene.add(petal)
  }

  // Flower center
  const centerGeometry = new THREE.SphereGeometry(0.06, 8, 8)
  const centerMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFF00 // Yellow center
  })
  const center = new THREE.Mesh(centerGeometry, centerMaterial)
  center.position.set(cornerX, 1.2, cornerZ)
  scene.add(center)

  // Leaves (2 simple leaves on the stem)
  const leafGeometry = new THREE.SphereGeometry(0.1, 8, 8)
  const leafMaterial = new THREE.MeshLambertMaterial({
    color: 0x32CD32 // Lime green
  })

  const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial)
  leaf1.position.set(cornerX - 0.12, 0.9, cornerZ)
  leaf1.scale.set(1.5, 0.3, 0.5)
  scene.add(leaf1)

  const leaf2 = new THREE.Mesh(leafGeometry, leafMaterial)
  leaf2.position.set(cornerX + 0.12, 1.0, cornerZ)
  leaf2.scale.set(1.5, 0.3, 0.5)
  scene.add(leaf2)
}

/**
 * Create a Christmas garden with snowy trees visible through the window
 */
function createChristmasGarden() {
  // Position trees outside the wall with window (x = -ROOM_SIZE/2)
  // Trees should be visible through window which is centered at z=0

  // Ground snow patch outside
  const snowGroundGeometry = new THREE.PlaneGeometry(15, 15)
  const snowGroundMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF, // Pure white snow
    side: THREE.DoubleSide
  })
  const snowGround = new THREE.Mesh(snowGroundGeometry, snowGroundMaterial)
  snowGround.rotation.x = -Math.PI / 2
  snowGround.position.set(-ROOM_SIZE / 2 - 7.5, 0, 0)
  snowGround.receiveShadow = true
  scene.add(snowGround)

  // Create multiple Christmas trees
  const treePositions = [
    { x: -ROOM_SIZE / 2 - 3, z: -2 },
    { x: -ROOM_SIZE / 2 - 5, z: 1 },
    { x: -ROOM_SIZE / 2 - 4, z: 3 },
    { x: -ROOM_SIZE / 2 - 6, z: -1 },
    { x: -ROOM_SIZE / 2 - 7, z: 2 }
  ]

  treePositions.forEach((pos, index) => {
    createChristmasTree(pos.x, pos.z, 1.5 + Math.random() * 0.5)
  })

  // Add some snow falling particles (simple white spheres) - store for animation
  for (let i = 0; i < 50; i++) {
    const snowflakeGeometry = new THREE.SphereGeometry(0.05, 6, 6)
    const snowflakeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    })
    const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial)
    snowflake.position.set(
      -ROOM_SIZE / 2 - 3 - Math.random() * 8,
      Math.random() * 10 + 2,
      -4 + Math.random() * 8
    )
    // Store fall speed for each snowflake
    snowflake.userData.fallSpeed = 0.01 + Math.random() * 0.02
    snowflake.userData.sway = Math.random() * 0.01
    snowflake.userData.swayOffset = Math.random() * Math.PI * 2
    snowflakes.push(snowflake)
    scene.add(snowflake)
  }
}

/**
 * Create a single Christmas tree at specified position
 */
function createChristmasTree(x, z, scale = 1.5) {
  // Tree trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.12 * scale, 0.4 * scale, 8)
  const trunkMaterial = new THREE.MeshLambertMaterial({
    color: 0x4A3728 // Dark brown
  })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.set(x, 0.2 * scale, z)
  trunk.castShadow = true
  scene.add(trunk)

  // Tree foliage (3 cones stacked)
  const foliageMaterial = new THREE.MeshLambertMaterial({
    color: 0x0D5F0D // Dark green
  })

  // Bottom cone
  const cone1Geometry = new THREE.ConeGeometry(0.6 * scale, 1.0 * scale, 8)
  const cone1 = new THREE.Mesh(cone1Geometry, foliageMaterial)
  cone1.position.set(x, 0.8 * scale, z)
  cone1.castShadow = true
  scene.add(cone1)

  // Middle cone
  const cone2Geometry = new THREE.ConeGeometry(0.5 * scale, 0.9 * scale, 8)
  const cone2 = new THREE.Mesh(cone2Geometry, foliageMaterial)
  cone2.position.set(x, 1.4 * scale, z)
  cone2.castShadow = true
  scene.add(cone2)

  // Top cone
  const cone3Geometry = new THREE.ConeGeometry(0.4 * scale, 0.8 * scale, 8)
  const cone3 = new THREE.Mesh(cone3Geometry, foliageMaterial)
  cone3.position.set(x, 1.9 * scale, z)
  cone3.castShadow = true
  scene.add(cone3)

  // Star on top
  const starGeometry = new THREE.SphereGeometry(0.1 * scale, 5, 5)
  const starMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFD700, // Gold
    emissive: 0xFFAA00,
    emissiveIntensity: 0.5
  })
  const star = new THREE.Mesh(starGeometry, starMaterial)
  star.position.set(x, 2.5 * scale, z)
  scene.add(star)

  // Snow on tree (white cones slightly larger)
  const snowMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF
  })

  const snow1 = new THREE.Mesh(
    new THREE.ConeGeometry(0.62 * scale, 0.3 * scale, 8),
    snowMaterial
  )
  snow1.position.set(x, 1.3 * scale, z)
  scene.add(snow1)

  const snow2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.52 * scale, 0.25 * scale, 8),
    snowMaterial
  )
  snow2.position.set(x, 1.85 * scale, z)
  scene.add(snow2)

  // Christmas lights (small colored spheres)
  const lightColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF]
  for (let i = 0; i < 8; i++) {
    const lightGeometry = new THREE.SphereGeometry(0.05 * scale, 4, 4)
    const lightMaterial = new THREE.MeshLambertMaterial({
      color: lightColors[i % lightColors.length],
      emissive: lightColors[i % lightColors.length],
      emissiveIntensity: 0.3
    })
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    const angle = (i / 8) * Math.PI * 2
    const radius = 0.4 * scale - (i * 0.05 * scale)
    const height = 0.8 * scale + (i * 0.2 * scale)
    light.position.set(
      x + Math.cos(angle) * radius,
      height,
      z + Math.sin(angle) * radius
    )
    scene.add(light)
  }
}

/**
 * Create Thomas the Train on the railway tracks
 */
function createThomasTrain() {
  // Create a group to hold all train parts
  train = new THREE.Group()

  // --- TRAIN BODY (Main boiler) ---
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16)
  const bodyMaterial = new THREE.MeshLambertMaterial({
    color: 0x0066B3 // Thomas blue
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.rotation.z = Math.PI / 2 // Horizontal orientation
  body.position.set(0, 0.5, 0)
  body.castShadow = true
  train.add(body)

  // --- TRAIN CAB (Driver's cabin) ---
  const cabGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.6)
  const cabMaterial = new THREE.MeshLambertMaterial({
    color: 0x0066B3 // Thomas blue
  })
  const cab = new THREE.Mesh(cabGeometry, cabMaterial)
  cab.position.set(-0.5, 0.5, 0)
  cab.castShadow = true
  train.add(cab)

  // --- CAB ROOF ---
  const roofGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.7)
  const roofMaterial = new THREE.MeshLambertMaterial({
    color: 0x0066B3
  })
  const roof = new THREE.Mesh(roofGeometry, roofMaterial)
  roof.position.set(-0.5, 0.85, 0)
  train.add(roof)

  // --- FACE (Thomas's face) ---
  const faceGeometry = new THREE.CircleGeometry(0.25, 16)
  const faceMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFE4C4 // Beige/face color
  })
  const face = new THREE.Mesh(faceGeometry, faceMaterial)
  face.position.set(0.61, 0.5, 0)
  face.rotation.y = Math.PI / 2
  train.add(face)

  // --- EYES (2 eyes) ---
  const eyeGeometry = new THREE.CircleGeometry(0.06, 16)
  const eyeMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000 // Black
  })
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
  leftEye.position.set(0.62, 0.55, -0.08)
  leftEye.rotation.y = Math.PI / 2
  train.add(leftEye)

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
  rightEye.position.set(0.62, 0.55, 0.08)
  rightEye.rotation.y = Math.PI / 2
  train.add(rightEye)

  // --- SMILE ---
  const smileGeometry = new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI)
  const smileMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000
  })
  const smile = new THREE.Mesh(smileGeometry, smileMaterial)
  smile.position.set(0.62, 0.42, 0)
  smile.rotation.set(0, Math.PI / 2, 0)
  train.add(smile)

  // --- FUNNEL (Chimney) ---
  const funnelGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 16)
  const funnelMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000 // Black funnel
  })
  const funnel = new THREE.Mesh(funnelGeometry, funnelMaterial)
  funnel.position.set(0.3, 0.95, 0)
  train.add(funnel)

  // --- FUNNEL TOP (Red rim) ---
  const funnelTopGeometry = new THREE.CylinderGeometry(0.11, 0.08, 0.05, 16)
  const funnelTopMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF0000 // Red
  })
  const funnelTop = new THREE.Mesh(funnelTopGeometry, funnelTopMaterial)
  funnelTop.position.set(0.3, 1.12, 0)
  train.add(funnelTop)

  // --- WHEELS (6 wheels - 3 on each side) ---
  const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16)
  const wheelMaterial = new THREE.MeshLambertMaterial({
    color: 0x333333 // Dark gray
  })

  const wheelPositions = [
    { x: 0.5, z: -0.4 },
    { x: 0, z: -0.4 },
    { x: -0.5, z: -0.4 },
    { x: 0.5, z: 0.4 },
    { x: 0, z: 0.4 },
    { x: -0.5, z: 0.4 }
  ]

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.rotation.x = Math.PI / 2
    wheel.position.set(pos.x, 0.15, pos.z)
    wheel.castShadow = true
    train.add(wheel)

    // Add wheel details (center hub)
    const hubGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16)
    const hubMaterial = new THREE.MeshLambertMaterial({
      color: 0xFF0000 // Red hub
    })
    const hub = new THREE.Mesh(hubGeometry, hubMaterial)
    hub.rotation.x = Math.PI / 2
    hub.position.set(pos.x, 0.15, pos.z)
    train.add(hub)
  })

  // --- BUFFERS (Front and back) ---
  const bufferGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16)
  const bufferMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF0000 // Red
  })

  const frontBuffer1 = new THREE.Mesh(bufferGeometry, bufferMaterial)
  frontBuffer1.rotation.z = Math.PI / 2
  frontBuffer1.position.set(0.75, 0.3, -0.15)
  train.add(frontBuffer1)

  const frontBuffer2 = new THREE.Mesh(bufferGeometry, bufferMaterial)
  frontBuffer2.rotation.z = Math.PI / 2
  frontBuffer2.position.set(0.75, 0.3, 0.15)
  train.add(frontBuffer2)

  // Position train at starting point on the tracks
  train.position.set(0, 0, trainPosition)
  train.scale.set(1.3, 1.3, 1.3) // Scale up for better visibility
  train.rotation.y = Math.PI / 2 // Rotate 90° to align with Z-axis tracks
  scene.add(train)

  // Create smoke particles for the chimney
  createSmokeParticles()
}

/**
 * Create smoke particles for the train chimney
 */
function createSmokeParticles() {
  // Create 15 smoke particles
  for (let i = 0; i < 15; i++) {
    const smokeGeometry = new THREE.SphereGeometry(0.08, 8, 8)
    const smokeMaterial = new THREE.MeshLambertMaterial({
      color: 0xAAAAAA, // Light gray smoke
      transparent: true,
      opacity: 0.6
    })
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial)

    // Store animation properties
    smoke.userData.lifetime = Math.random() * 2 // Random start offset
    smoke.userData.maxLifetime = 2 // 2 seconds lifetime
    smoke.userData.initialScale = 1.0

    smokeParticles.push(smoke)
    scene.add(smoke)
  }
}

/**
 * Animate snowflakes falling and train movement
 */
function animateSnowAndTrain() {
  // Animate snowflakes
  snowflakes.forEach((snowflake, index) => {
    // Fall down
    snowflake.position.y -= snowflake.userData.fallSpeed

    // Sway left and right
    snowflake.position.x += Math.sin(Date.now() * 0.001 + snowflake.userData.swayOffset) * snowflake.userData.sway

    // Reset to top when reaching ground
    if (snowflake.position.y < 0) {
      snowflake.position.y = 10 + Math.random() * 2
      snowflake.position.x = -ROOM_SIZE / 2 - 3 - Math.random() * 8
      snowflake.position.z = -4 + Math.random() * 8
    }
  })

  // Animate train
  if (train) {
    // Move train along Z axis (along the tracks)
    trainPosition += 0.02

    // Reset train position when it goes off screen
    if (trainPosition > ROOM_SIZE / 2 + 3) {
      trainPosition = -ROOM_SIZE / 2 - 3
    }

    train.position.z = trainPosition

    // Slight bobbing motion
    train.position.y = 0.02 * Math.sin(Date.now() * 0.005)

    // Rotate wheels
    train.children.forEach(child => {
      if (child.geometry && child.geometry.type === 'CylinderGeometry' &&
          child.material.color.getHex() === 0x333333) {
        child.rotation.x += 0.1
      }
    })
  }

  // Animate smoke particles
  if (train) {
    smokeParticles.forEach((smoke, index) => {
      // Update lifetime
      smoke.userData.lifetime += 0.016 // ~60fps

      if (smoke.userData.lifetime >= smoke.userData.maxLifetime) {
        // Reset particle to chimney position
        smoke.userData.lifetime = 0

        // Funnel is at relative position (0.3, 1.12, 0) in train group
        // After rotation of train by 90°, we need to adjust coordinates
        // Original funnel: x=0.3, y=1.12, z=0
        // After 90° Y rotation: new x=0, new y=1.12, new z=-0.3
        const funnelOffset = new THREE.Vector3(0, 1.12, -0.3)
        funnelOffset.applyMatrix4(train.matrix)

        smoke.position.copy(train.position).add(funnelOffset)
        smoke.scale.set(1, 1, 1)
        smoke.material.opacity = 0.6
      } else {
        // Rise up and expand
        const progress = smoke.userData.lifetime / smoke.userData.maxLifetime

        // Move upward
        smoke.position.y += 0.015

        // Slight drift (sway)
        smoke.position.x += Math.sin(Date.now() * 0.002 + index) * 0.005
        smoke.position.z += Math.cos(Date.now() * 0.002 + index) * 0.005

        // Expand as it rises
        const scale = 1 + progress * 2
        smoke.scale.set(scale, scale, scale)

        // Fade out
        smoke.material.opacity = 0.6 * (1 - progress)
      }
    })
  }
}

/**
 * Animation loop - renders the scene continuously
 */
function animate() {
  animationId = requestAnimationFrame(animate)

  // Animate snow and train
  animateSnowAndTrain()

  // Update camera movement from keyboard
  updateCameraMovement()

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

/**
 * Handle keyboard key down events
 */
function handleKeyDown(event) {
  const key = event.key.toLowerCase()

  // Toggle help with H key
  if (key === 'h') {
    showHelp.value = !showHelp.value
    return
  }

  // Reset camera with R key
  if (key === 'r') {
    resetCamera()
    return
  }

  // Track movement keys
  if (key in keys) {
    keys[key] = true
  }
}

/**
 * Handle keyboard key up events
 */
function handleKeyUp(event) {
  const key = event.key.toLowerCase()
  if (key in keys) {
    keys[key] = false
  }
}

/**
 * Update camera position based on keyboard input
 */
function updateCameraMovement() {
  if (!camera || !controls) return

  const speed = moveSpeed.value * 0.5

  // Forward/Backward (W/S or Arrow Up/Down)
  if (keys.w || keys.arrowup) {
    camera.position.z -= speed
    controls.target.z -= speed
  }
  if (keys.s || keys.arrowdown) {
    camera.position.z += speed
    controls.target.z += speed
  }

  // Left/Right (A/D or Arrow Left/Right)
  if (keys.a || keys.arrowleft) {
    camera.position.x -= speed
    controls.target.x -= speed
  }
  if (keys.d || keys.arrowright) {
    camera.position.x += speed
    controls.target.x += speed
  }

  // Rotate Left/Right (Q/E)
  if (keys.q) {
    const angle = 0.02
    const x = camera.position.x - controls.target.x
    const z = camera.position.z - controls.target.z
    camera.position.x = controls.target.x + (x * Math.cos(angle) - z * Math.sin(angle))
    camera.position.z = controls.target.z + (x * Math.sin(angle) + z * Math.cos(angle))
  }
  if (keys.e) {
    const angle = -0.02
    const x = camera.position.x - controls.target.x
    const z = camera.position.z - controls.target.z
    camera.position.x = controls.target.x + (x * Math.cos(angle) - z * Math.sin(angle))
    camera.position.z = controls.target.z + (x * Math.sin(angle) + z * Math.cos(angle))
  }

  // Update zoom level display
  const distance = camera.position.distanceTo(controls.target)
  currentZoom.value = distance
}

/**
 * Reset camera to initial position
 */
function resetCamera() {
  if (!camera || !controls) return

  camera.position.set(
    initialCameraPosition.x,
    initialCameraPosition.y,
    initialCameraPosition.z
  )
  controls.target.set(0, 0, 0)
  controls.update()
}

/**
 * Toggle Christmas music play/pause
 */
function toggleMusic() {
  if (!christmasMusic.value) return

  if (isMusicPlaying.value) {
    christmasMusic.value.pause()
    isMusicPlaying.value = false
  } else {
    christmasMusic.value.play().catch(err => {
      console.log('Audio play error:', err)
    })
    isMusicPlaying.value = true
  }
}

/**
 * Update music volume
 */
function updateVolume() {
  if (christmasMusic.value) {
    christmasMusic.value.volume = musicVolume.value / 100
  }
}

/**
 * Play jingle bell sound using Web Audio API
 */
function playJingleBell() {
  if (!audioContext) return

  // Create oscillators for a bell-like sound
  const now = audioContext.currentTime

  // Bell sound using multiple frequencies
  const frequencies = [800, 1000, 1200] // C major chord frequencies

  frequencies.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = freq
    oscillator.type = 'sine'

    // Envelope for bell sound (quick attack, long decay)
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01) // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5) // Decay

    oscillator.start(now + index * 0.05) // Slight delay between notes
    oscillator.stop(now + 0.6)
  })
}

/**
 * Play train whistle sound
 */
function playTrainWhistle() {
  if (!audioContext) return

  const now = audioContext.currentTime

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Train whistle is typically around 500-700 Hz
  oscillator.frequency.setValueAtTime(650, now)
  oscillator.frequency.linearRampToValueAtTime(550, now + 0.5)
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(0.4, now + 0.1)
  gainNode.gain.linearRampToValueAtTime(0.4, now + 0.4)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

  oscillator.start(now)
  oscillator.stop(now + 0.8)
}
</script>

<style scoped>
.threejs-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* Help Overlay */
.help-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in;
}

.help-content {
  background: linear-gradient(135deg, #0066B3 0%, #4682B4 100%);
  padding: 2rem;
  border-radius: 15px;
  max-width: 500px;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 3px solid #FFD700;
}

.help-content h2 {
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-size: 1.8rem;
  color: #FFD700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.help-section {
  margin-bottom: 1.5rem;
}

.help-section h3 {
  color: #87CEEB;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.help-section p {
  margin: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

.help-section strong {
  color: #FFD700;
}

.close-btn {
  width: 100%;
  padding: 0.75rem;
  background: #FFD700;
  color: #0066B3;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #FFA500;
  transform: scale(1.05);
}

/* Train Dashboard */
.train-dashboard {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #8B3A3A 0%, #D2691E 100%);
  padding: 1.5rem;
  border-radius: 15px;
  min-width: 250px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
  border: 3px solid #FFD700;
  z-index: 100;
}

.dashboard-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #FFD700;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.dashboard-controls {
  color: white;
}

.control-group {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-weight: bold;
  min-width: 80px;
  color: #FFD700;
}

.control-group input[type="range"] {
  flex: 1;
  cursor: pointer;
}

.control-group span {
  min-width: 40px;
  text-align: right;
  font-weight: bold;
  color: white;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.control-buttons button {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset {
  background: #228B22;
  color: white;
}

.btn-reset:hover {
  background: #32CD32;
  transform: scale(1.05);
}

.btn-help {
  background: #FFD700;
  color: #0066B3;
}

.btn-help:hover {
  background: #FFA500;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .train-dashboard {
    top: 10px;
    right: 10px;
    min-width: 200px;
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.1rem;
  }

  .help-content {
    max-width: 90%;
    padding: 1.5rem;
  }

  .help-content h2 {
    font-size: 1.4rem;
  }
}
</style>
