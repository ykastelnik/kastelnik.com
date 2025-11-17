<!--
  Isometric Room Component

  Main component that orchestrates the entire Three.js scene.

  For Three.js beginners:
  - This file uses Vue 3's Composition API with <script setup>
  - Three.js renders 3D graphics using WebGL
  - The scene contains: camera, lights, objects, and animations
  - Animation loop runs 60 times per second (60 FPS)
  - OrbitControls let users rotate/zoom/pan the camera
-->

<template>
  <div ref="containerRef" class="threejs-container">
    <!-- ==================== HELP OVERLAY ==================== -->
    <!-- Modal that shows keyboard/mouse controls -->
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

    <!-- ==================== TRAIN DASHBOARD ==================== -->
    <!-- Control panel for scene settings -->
    <div class="train-dashboard">
      <div class="dashboard-title">🚂 Thomas Control Panel 🎄</div>

      <div class="dashboard-controls">
        <!-- Camera movement speed -->
        <div class="control-group">
          <label>Speed:</label>
          <input type="range" v-model="moveSpeed" min="0.1" max="2" step="0.1" />
          <span>{{ moveSpeed }}</span>
        </div>

        <!-- Current zoom level (read-only) -->
        <div class="control-group">
          <label>Zoom Level:</label>
          <span>{{ currentZoom.toFixed(1) }}</span>
        </div>

        <!-- Music play/pause button -->
        <div class="control-group">
          <label>Music:</label>
          <button @click="audio.toggleMusic" class="btn-music">
            {{ audio.isMusicPlaying.value ? '🔊 Pause' : '🔇 Play' }}
          </button>
        </div>

        <!-- Music volume slider -->
        <div class="control-group">
          <label>Volume:</label>
          <input
            type="range"
            v-model="audio.musicVolume.value"
            min="0"
            max="100"
            step="1"
            @input="audio.updateVolume"
          />
          <span>{{ audio.musicVolume.value }}%</span>
        </div>

        <!-- Action buttons -->
        <div class="control-buttons">
          <button @click="resetCamera" class="btn-reset">🔄 Reset View</button>
          <button @click="showHelp = !showHelp" class="btn-help">❓ Help</button>
        </div>
      </div>
    </div>

    <!-- ==================== AUDIO ELEMENT ==================== -->
    <!-- HTML5 audio for background music -->
    <audio ref="audioElement" loop>
      <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
/**
 * ============================================================
 * IMPORTS
 * ============================================================
 */

// Vue reactivity and lifecycle
import { ref, onMounted, onUnmounted } from 'vue'

// Three.js core and controls
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Our custom modules
import { createRoom } from '../modules/room.js'
import { createThomasTrain, animateTrainWheels } from '../modules/thomas-train.js'
import { createChristmasGarden, animateSnowflakes } from '../modules/christmas-garden.js'
import { createSmokeParticles, animateSmokeParticles } from '../modules/smoke-particles.js'

// Audio composable
import { useAudio } from '../composables/useAudio.js'

/**
 * ============================================================
 * CONSTANTS
 * ============================================================
 */

const ROOM_SIZE = 10  // Size of room in Three.js units

// Initial camera position for reset button
const INITIAL_CAMERA_POSITION = { x: 10, y: 10, z: 10 }

/**
 * ============================================================
 * TEMPLATE REFS
 * ============================================================
 * References to DOM elements in the template
 */

const containerRef = ref(null)  // Main container div
const audioElement = ref(null)  // Audio element for music

/**
 * ============================================================
 * AUDIO SETUP
 * ============================================================
 */

const audio = useAudio()

/**
 * ============================================================
 * UI STATE
 * ============================================================
 * Reactive variables that control the UI
 */

const showHelp = ref(true)     // Show help overlay on startup
const moveSpeed = ref(0.5)     // Camera movement speed
const currentZoom = ref(15)    // Current zoom level (distance from target)

/**
 * ============================================================
 * THREE.JS OBJECTS
 * ============================================================
 * Core Three.js objects (not reactive)
 */

let scene               // THREE.Scene - Container for all 3D objects
let camera              // THREE.Camera - Viewpoint for rendering
let renderer            // THREE.WebGLRenderer - Draws scene to canvas
let controls            // OrbitControls - Mouse/touch camera controls
let animationId         // ID for requestAnimationFrame (for cleanup)

/**
 * ============================================================
 * ANIMATED OBJECTS
 * ============================================================
 * References to objects that need animation
 */

let train = null           // Thomas the Train group
let trainPosition = -ROOM_SIZE / 2  // Current position along tracks
let snowflakes = []        // Array of snowflake meshes
let smokeParticles = []    // Array of smoke particle meshes

/**
 * ============================================================
 * KEYBOARD STATE
 * ============================================================
 * Tracks which keys are currently pressed
 */

const keys = {
  w: false, a: false, s: false, d: false,           // WASD
  arrowup: false, arrowdown: false,                 // Arrow keys
  arrowleft: false, arrowright: false,
  q: false, e: false                                 // Q/E rotation
}

/**
 * ============================================================
 * LIFECYCLE - COMPONENT MOUNTED
 * ============================================================
 * Runs once when Vue component is added to the DOM
 */

onMounted(() => {
  // Initialize Three.js scene
  initScene()

  // Start animation loop
  animate()

  // Add event listeners
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  // Initialize Web Audio API
  audio.initAudioContext()

  // Set up music element
  if (audioElement.value) {
    audio.setMusicRef(audioElement.value)
  }
})

/**
 * ============================================================
 * LIFECYCLE - COMPONENT UNMOUNTED
 * ============================================================
 * Cleanup when Vue component is removed from DOM
 */

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)

  // Stop animation loop
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // Dispose Three.js resources
  if (controls) {
    controls.dispose()
  }
  if (renderer) {
    renderer.dispose()
  }

  // Clean up audio
  audio.cleanup()
})

/**
 * ============================================================
 * SCENE INITIALIZATION
 * ============================================================
 * Creates the Three.js scene with camera, lights, and objects
 */

function initScene() {
  // --- SCENE ---
  // Container for all 3D objects
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB)  // Sky blue (visible through window)

  // --- CAMERA ---
  // OrthographicCamera creates isometric (parallel projection) view
  // Unlike PerspectiveCamera, objects don't get smaller with distance
  const aspect = window.innerWidth / window.innerHeight
  const frustumSize = 15  // Controls the "zoom" level

  camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,  // left
    frustumSize * aspect / 2,   // right
    frustumSize / 2,            // top
    frustumSize / -2,           // bottom
    0.1,                        // near clipping plane
    1000                        // far clipping plane
  )

  // Position camera for isometric view (45° angles)
  camera.position.set(INITIAL_CAMERA_POSITION.x, INITIAL_CAMERA_POSITION.y, INITIAL_CAMERA_POSITION.z)
  camera.lookAt(0, 0, 0)  // Point camera at scene center

  // --- RENDERER ---
  // WebGLRenderer draws the scene using GPU acceleration
  renderer = new THREE.WebGLRenderer({ antialias: true })  // Smooth edges
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)  // Sharp on high-DPI screens

  // Enable shadows
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap  // Soft shadow edges

  // Add renderer's canvas to DOM
  containerRef.value.appendChild(renderer.domElement)

  // --- ORBIT CONTROLS ---
  // Allows user to rotate/pan/zoom camera with mouse
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true     // Smooth, inertial movement
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = true // Pan parallel to screen
  controls.minDistance = 2          // Closest zoom
  controls.maxDistance = 80         // Farthest zoom
  controls.enablePan = true
  controls.panSpeed = 1.0
  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2

  // --- LIGHTING ---
  // Ambient light illuminates everything equally (no direction)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // Directional light casts shadows (like sunlight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true

  // Configure shadow map size and area
  directionalLight.shadow.camera.left = -15
  directionalLight.shadow.camera.right = 15
  directionalLight.shadow.camera.top = 15
  directionalLight.shadow.camera.bottom = -15
  directionalLight.shadow.mapSize.width = 2048   // Higher = sharper shadows
  directionalLight.shadow.mapSize.height = 2048

  scene.add(directionalLight)

  // --- CREATE SCENE OBJECTS ---
  // Use our modular functions to build the scene
  createRoom(scene, ROOM_SIZE)
  snowflakes = createChristmasGarden(scene, ROOM_SIZE)

  // Create and position Thomas the Train
  train = createThomasTrain()
  train.position.set(0, 0, trainPosition)
  train.scale.set(1.3, 1.3, 1.3)              // Make train larger
  train.rotation.y = Math.PI / 2              // Rotate 90° to align with tracks
  scene.add(train)

  // Create smoke particles
  smokeParticles = createSmokeParticles(scene, 15)
}

/**
 * ============================================================
 * ANIMATION LOOP
 * ============================================================
 * Runs continuously (typically 60 times per second)
 * Updates animations and renders the scene
 */

function animate() {
  // Schedule next frame
  animationId = requestAnimationFrame(animate)

  // Animate snowflakes falling
  animateSnowflakes(snowflakes, ROOM_SIZE)

  // Animate train movement
  if (train) {
    // Move train along Z-axis (along the tracks)
    trainPosition += 0.02

    // Reset to start when train goes off-screen
    if (trainPosition > ROOM_SIZE / 2 + 3) {
      trainPosition = -ROOM_SIZE / 2 - 3
    }

    train.position.z = trainPosition

    // Slight vertical bobbing for realism
    train.position.y = 0.02 * Math.sin(Date.now() * 0.005)

    // Rotate wheels
    animateTrainWheels(train, 0.1)
  }

  // Animate smoke from chimney
  animateSmokeParticles(smokeParticles, train)

  // Update camera from keyboard input
  updateCameraMovement()

  // Update controls (for damping effect)
  if (controls) {
    controls.update()
  }

  // Render the scene from camera's perspective
  renderer.render(scene, camera)
}

/**
 * ============================================================
 * KEYBOARD CONTROLS
 * ============================================================
 */

/**
 * Handle key press (key down)
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
 * Handle key release (key up)
 */
function handleKeyUp(event) {
  const key = event.key.toLowerCase()
  if (key in keys) {
    keys[key] = false
  }
}

/**
 * Update camera position based on keyboard input
 * Called every frame in animation loop
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

  // Rotate camera around target (Q/E keys)
  // Uses rotation matrix math to orbit around target
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
 * ============================================================
 * CAMERA CONTROLS
 * ============================================================
 */

/**
 * Reset camera to initial position
 */
function resetCamera() {
  if (!camera || !controls) return

  camera.position.set(
    INITIAL_CAMERA_POSITION.x,
    INITIAL_CAMERA_POSITION.y,
    INITIAL_CAMERA_POSITION.z
  )
  controls.target.set(0, 0, 0)
  controls.update()
}

/**
 * ============================================================
 * WINDOW RESIZE HANDLER
 * ============================================================
 * Updates camera and renderer when window size changes
 */

function handleResize() {
  const aspect = window.innerWidth / window.innerHeight
  const frustumSize = 15

  // Update camera projection matrix
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
/* ============================================================
   BASE CONTAINER
   ============================================================ */
.threejs-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* ============================================================
   HELP OVERLAY
   ============================================================ */
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

/* ============================================================
   TRAIN DASHBOARD
   ============================================================ */
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

.btn-music {
  background: #4682B4;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-music:hover {
  background: #5A9BD4;
  transform: scale(1.05);
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

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ============================================================
   RESPONSIVE DESIGN
   ============================================================ */
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
