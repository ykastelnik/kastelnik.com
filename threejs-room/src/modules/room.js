/**
 * Room Module
 *
 * This module handles the creation of the room structure including:
 * - Floor with railway gray color
 * - Railway tracks (rails and sleepers)
 * - Two walls forming an L-corner (Thomas blue and red brick)
 * - Window with wooden frame on the red brick wall
 * - Coffee table with flower pot in the corner
 *
 * For Three.js beginners:
 * - THREE.Mesh combines geometry (shape) and material (appearance)
 * - Textures are created using Canvas API and applied to materials
 * - Position is set using .position.set(x, y, z) where y is up
 * - Rotation uses radians: Math.PI/2 = 90 degrees
 */

import * as THREE from 'three'

/**
 * Creates a procedural brick texture using HTML5 Canvas
 *
 * @param {string} brickColor - Hex color for bricks (e.g., '#0066B3')
 * @param {string} mortarColor - Hex color for mortar between bricks
 * @returns {THREE.CanvasTexture} A texture that can be applied to materials
 *
 * How it works:
 * 1. Creates an invisible canvas element
 * 2. Draws a repeating brick pattern with offset rows
 * 3. Converts canvas to a Three.js texture
 */
function createBrickTexture(brickColor, mortarColor) {
  // Create a 512x512 pixel canvas for the texture
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Fill background with mortar (the gaps between bricks)
  ctx.fillStyle = mortarColor
  ctx.fillRect(0, 0, 512, 512)

  // Draw individual bricks in a pattern
  ctx.fillStyle = brickColor
  const brickWidth = 100
  const brickHeight = 40
  const mortarWidth = 4

  // Loop through rows and columns to create brick pattern
  for (let y = 0; y < 512; y += brickHeight + mortarWidth) {
    for (let x = 0; x < 512; x += brickWidth + mortarWidth) {
      // Offset every other row by half a brick width for realistic pattern
      const offset = (Math.floor(y / (brickHeight + mortarWidth)) % 2) * (brickWidth / 2)
      ctx.fillRect(x + offset, y, brickWidth, brickHeight)
    }
  }

  // Convert canvas to Three.js texture
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping // Repeat horizontally
  texture.wrapT = THREE.RepeatWrapping // Repeat vertically
  texture.repeat.set(2, 2) // Repeat texture 2x in each direction
  return texture
}

/**
 * Creates the complete room structure
 *
 * @param {THREE.Scene} scene - The Three.js scene to add objects to
 * @param {number} roomSize - Size of the room (width and depth)
 *
 * This function creates:
 * - A horizontal floor plane
 * - Railway tracks running along the Z-axis
 * - Back wall (Thomas blue brick)
 * - Side wall (red brick) with a window cutout
 * - Window frame made of wooden beams
 * - Coffee table with decorative flower pot
 */
export function createRoom(scene, roomSize) {
  // ============================================================
  // FLOOR - The base platform for our scene
  // ============================================================

  // PlaneGeometry creates a flat rectangle. It needs rotation to be horizontal.
  const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize)

  // MeshLambertMaterial responds to lighting (vs MeshBasicMaterial which doesn't)
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0x808080, // Railway gray color (hex format)
    side: THREE.DoubleSide // Visible from both sides
  })

  const floor = new THREE.Mesh(floorGeometry, floorMaterial)

  // Rotate -90 degrees around X-axis to make plane horizontal
  // (PlaneGeometry defaults to vertical, facing camera)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0 // Ground level
  floor.receiveShadow = true // Can receive shadows from other objects
  scene.add(floor)

  // ============================================================
  // RAILWAY TRACKS - Rails and sleepers (ties)
  // ============================================================

  const railMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A }) // Dark gray
  const sleeperMaterial = new THREE.MeshLambertMaterial({ color: 0x5C4033 }) // Brown wood

  // Create two parallel rails using BoxGeometry (rectangular prisms)
  const railGeometry = new THREE.BoxGeometry(0.15, 0.1, roomSize)

  // Left rail
  const rail1 = new THREE.Mesh(railGeometry, railMaterial)
  rail1.position.set(-0.7, 0.05, 0) // Slightly above floor
  scene.add(rail1)

  // Right rail
  const rail2 = new THREE.Mesh(railGeometry, railMaterial)
  rail2.position.set(0.7, 0.05, 0)
  scene.add(rail2)

  // Create wooden sleepers (cross ties) every 0.8 units
  const sleeperGeometry = new THREE.BoxGeometry(2, 0.08, 0.2)
  for (let i = -roomSize / 2; i < roomSize / 2; i += 0.8) {
    const sleeper = new THREE.Mesh(sleeperGeometry, sleeperMaterial)
    sleeper.position.set(0, 0.04, i)
    scene.add(sleeper)
  }

  // ============================================================
  // WALL 1 - Back wall with Thomas blue brick texture
  // ============================================================

  const wall1Geometry = new THREE.PlaneGeometry(roomSize, roomSize)

  // Create Thomas the Tank Engine blue brick texture
  const thomasBlueBrickTexture = createBrickTexture('#0066B3', '#C0C0C0')

  const wall1Material = new THREE.MeshLambertMaterial({
    map: thomasBlueBrickTexture, // Apply the texture
    side: THREE.DoubleSide
  })

  const wall1 = new THREE.Mesh(wall1Geometry, wall1Material)
  // Position at back of room (negative Z)
  wall1.position.set(0, roomSize / 2, -roomSize / 2)
  wall1.receiveShadow = true
  wall1.castShadow = true
  scene.add(wall1)

  // ============================================================
  // WALL 2 - Side wall with red brick and window cutout
  // ============================================================

  // THREE.Shape lets us create custom 2D shapes with holes
  const wallShape = new THREE.Shape()

  // Draw outer rectangle (the full wall)
  wallShape.moveTo(-roomSize / 2, 0)
  wallShape.lineTo(roomSize / 2, 0)
  wallShape.lineTo(roomSize / 2, roomSize)
  wallShape.lineTo(-roomSize / 2, roomSize)
  wallShape.lineTo(-roomSize / 2, 0)

  // Define window dimensions and position
  const windowWidth = 3
  const windowHeight = 4
  const windowX = 0 // Centered horizontally
  const windowY = 3 // Height from floor

  // Create a hole in the wall for the window
  const windowHole = new THREE.Path()
  windowHole.moveTo(windowX - windowWidth / 2, windowY - windowHeight / 2)
  windowHole.lineTo(windowX + windowWidth / 2, windowY - windowHeight / 2)
  windowHole.lineTo(windowX + windowWidth / 2, windowY + windowHeight / 2)
  windowHole.lineTo(windowX - windowWidth / 2, windowY + windowHeight / 2)
  windowHole.lineTo(windowX - windowWidth / 2, windowY - windowHeight / 2)

  // Add the hole to our wall shape
  wallShape.holes.push(windowHole)

  // Convert 2D shape to 3D geometry (flat, no extrusion)
  const wall2Geometry = new THREE.ShapeGeometry(wallShape)

  // Create red brick texture
  const redBrickTexture = createBrickTexture('#8B3A3A', '#D3D3D3')

  const wall2Material = new THREE.MeshLambertMaterial({
    map: redBrickTexture,
    side: THREE.DoubleSide
  })

  const wall2 = new THREE.Mesh(wall2Geometry, wall2Material)

  // Rotate 90 degrees to face inward (perpendicular to wall 1)
  wall2.rotation.y = Math.PI / 2
  wall2.position.set(-roomSize / 2, 0, 0)
  wall2.receiveShadow = true
  wall2.castShadow = true
  scene.add(wall2)

  // ============================================================
  // WINDOW FRAME - Decorative wooden frame around window
  // ============================================================

  const frameMaterial = new THREE.MeshLambertMaterial({
    color: 0x8B4513, // Brown wood color
    side: THREE.DoubleSide
  })

  const frameThickness = 0.15
  const frameDepth = 0.1

  // Top horizontal frame bar
  const topFrameGeometry = new THREE.BoxGeometry(
    frameDepth,
    frameThickness,
    windowWidth + frameThickness * 2
  )
  const topFrame = new THREE.Mesh(topFrameGeometry, frameMaterial)
  topFrame.position.set(
    -roomSize / 2 - frameDepth / 2, // Just in front of wall
    windowY + windowHeight / 2 + frameThickness / 2,
    windowX
  )
  scene.add(topFrame)

  // Bottom horizontal frame bar
  const bottomFrame = new THREE.Mesh(topFrameGeometry, frameMaterial)
  bottomFrame.position.set(
    -roomSize / 2 - frameDepth / 2,
    windowY - windowHeight / 2 - frameThickness / 2,
    windowX
  )
  scene.add(bottomFrame)

  // Vertical frame bars (left and right)
  const sideFrameGeometry = new THREE.BoxGeometry(
    frameDepth,
    windowHeight + frameThickness * 2,
    frameThickness
  )

  // Left frame bar
  const leftFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial)
  leftFrame.position.set(
    -roomSize / 2 - frameDepth / 2,
    windowY,
    windowX - windowWidth / 2 - frameThickness / 2
  )
  scene.add(leftFrame)

  // Right frame bar
  const rightFrame = new THREE.Mesh(sideFrameGeometry, frameMaterial)
  rightFrame.position.set(
    -roomSize / 2 - frameDepth / 2,
    windowY,
    windowX + windowWidth / 2 + frameThickness / 2
  )
  scene.add(rightFrame)

  // ============================================================
  // COFFEE TABLE WITH FLOWER POT - Decorative corner furniture
  // ============================================================

  createCoffeeTableWithFlower(scene, roomSize)
}

/**
 * Creates a coffee table with a flower pot decoration
 *
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} roomSize - Size of the room
 *
 * Components:
 * - Table top (rectangular box)
 * - Four legs (cylinders)
 * - Terracotta pot with soil
 * - Plant with stem, leaves, petals, and center
 */
function createCoffeeTableWithFlower(scene, roomSize) {
  // Position table in the corner
  const cornerX = -roomSize / 2 + 1.5
  const cornerZ = -roomSize / 2 + 1.5

  // ============================================================
  // COFFEE TABLE
  // ============================================================

  // Table top - rectangular brown wood
  const tableTopGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.8)
  const tableTopMaterial = new THREE.MeshLambertMaterial({
    color: 0x8B4513 // Brown wood
  })
  const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial)
  tableTop.position.set(cornerX, 0.5, cornerZ)
  tableTop.castShadow = true
  tableTop.receiveShadow = true
  scene.add(tableTop)

  // Table legs - four cylindrical legs at corners
  const legGeometry = new THREE.BoxGeometry(0.08, 0.5, 0.08)
  const legMaterial = new THREE.MeshLambertMaterial({
    color: 0x654321 // Darker brown
  })

  // Define positions for all four legs (relative to table center)
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

  // ============================================================
  // FLOWER POT
  // ============================================================

  // Pot body - tapered cylinder (wider at top)
  const potGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.25, 16)
  const potMaterial = new THREE.MeshLambertMaterial({
    color: 0xD2691E // Terracotta orange
  })
  const pot = new THREE.Mesh(potGeometry, potMaterial)
  pot.position.set(cornerX, 0.675, cornerZ) // On table
  pot.castShadow = true
  pot.receiveShadow = true
  scene.add(pot)

  // Soil inside pot
  const soilGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16)
  const soilMaterial = new THREE.MeshLambertMaterial({
    color: 0x3E2723 // Dark brown
  })
  const soil = new THREE.Mesh(soilGeometry, soilMaterial)
  soil.position.set(cornerX, 0.775, cornerZ) // Top of pot
  scene.add(soil)

  // ============================================================
  // FLOWER/PLANT
  // ============================================================

  // Green stem (thin cylinder)
  const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8)
  const stemMaterial = new THREE.MeshLambertMaterial({
    color: 0x228B22 // Forest green
  })
  const stem = new THREE.Mesh(stemGeometry, stemMaterial)
  stem.position.set(cornerX, 1.0, cornerZ) // Growing from soil
  scene.add(stem)

  // Flower petals - 5 pink spheres arranged in a circle
  const petalGeometry = new THREE.SphereGeometry(0.08, 8, 8)
  const petalMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF69B4 // Hot pink
  })

  const petalCount = 5
  const petalRadius = 0.1 // Distance from center

  for (let i = 0; i < petalCount; i++) {
    // Calculate position using circular arrangement
    const angle = (i / petalCount) * Math.PI * 2
    const petal = new THREE.Mesh(petalGeometry, petalMaterial)
    petal.position.set(
      cornerX + Math.cos(angle) * petalRadius,
      1.2,
      cornerZ + Math.sin(angle) * petalRadius
    )
    petal.scale.set(0.8, 0.5, 0.8) // Flatten slightly
    scene.add(petal)
  }

  // Flower center - yellow sphere
  const centerGeometry = new THREE.SphereGeometry(0.06, 8, 8)
  const centerMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFF00 // Yellow
  })
  const center = new THREE.Mesh(centerGeometry, centerMaterial)
  center.position.set(cornerX, 1.2, cornerZ)
  scene.add(center)

  // Leaves - 2 flattened spheres on the stem
  const leafGeometry = new THREE.SphereGeometry(0.1, 8, 8)
  const leafMaterial = new THREE.MeshLambertMaterial({
    color: 0x32CD32 // Lime green
  })

  const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial)
  leaf1.position.set(cornerX - 0.12, 0.9, cornerZ)
  leaf1.scale.set(1.5, 0.3, 0.5) // Flatten and stretch
  scene.add(leaf1)

  const leaf2 = new THREE.Mesh(leafGeometry, leafMaterial)
  leaf2.position.set(cornerX + 0.12, 1.0, cornerZ)
  leaf2.scale.set(1.5, 0.3, 0.5)
  scene.add(leaf2)
}
