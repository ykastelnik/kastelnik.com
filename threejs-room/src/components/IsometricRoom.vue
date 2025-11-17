<template>
  <div ref="containerRef" class="threejs-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// Template ref for the container element
const containerRef = ref(null)

// Three.js core objects
let scene, camera, renderer, animationId

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
  if (renderer) {
    renderer.dispose()
  }
})

/**
 * Initialize the Three.js scene, camera, renderer, and objects
 */
function initScene() {
  // === SCENE SETUP ===
  // Create the scene with a sky blue background (visible through the window)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB) // Sky blue

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
 * Create the room: floor and two adjacent walls with a window
 */
function createRoom() {
  // --- FLOOR ---
  // Soft orange floor (#FFA07A)
  const floorGeometry = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE)
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFA07A,
    side: THREE.DoubleSide
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2 // Rotate to be horizontal
  floor.position.y = 0
  floor.receiveShadow = true
  scene.add(floor)

  // --- WALL 1 (Deep Blue) ---
  // Position: back wall (along Z-axis)
  const wall1Geometry = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE)
  const wall1Material = new THREE.MeshLambertMaterial({
    color: 0x4682B4, // Deep blue
    side: THREE.DoubleSide
  })
  const wall1 = new THREE.Mesh(wall1Geometry, wall1Material)
  wall1.position.set(0, ROOM_SIZE / 2, -ROOM_SIZE / 2)
  wall1.receiveShadow = true
  wall1.castShadow = true
  scene.add(wall1)

  // --- WALL 2 (Sunny Yellow) with Window ---
  // Position: left wall (along X-axis)
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
  const wall2Material = new THREE.MeshLambertMaterial({
    color: 0xFFD700, // Sunny yellow
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
