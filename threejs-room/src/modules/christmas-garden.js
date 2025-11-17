/**
 * Christmas Garden Module
 *
 * Creates a festive winter scene visible through the window including:
 * - Snowy ground
 * - Decorated Christmas trees with lights, snow, and stars
 * - Animated falling snowflakes
 *
 * For Three.js beginners:
 * - ConeGeometry is perfect for creating tree shapes
 * - userData property stores custom data for each object
 * - Math.sin() and Math.cos() create circular patterns
 * - Animation involves updating position each frame
 */

import * as THREE from 'three'

/**
 * Creates the complete Christmas garden scene
 *
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} roomSize - Size of the room (for positioning)
 * @returns {Array<THREE.Mesh>} Array of snowflake meshes for animation
 *
 * This creates:
 * - A white snowy ground plane outside the window
 * - 5 Christmas trees at various positions
 * - 50 falling snowflake particles
 */
export function createChristmasGarden(scene, roomSize) {
  // Store snowflakes to return for animation
  const snowflakes = []

  // ============================================================
  // SNOWY GROUND - White plane outside the window
  // ============================================================

  const snowGroundGeometry = new THREE.PlaneGeometry(15, 15)
  const snowGroundMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF, // Pure white
    side: THREE.DoubleSide
  })
  const snowGround = new THREE.Mesh(snowGroundGeometry, snowGroundMaterial)

  // Rotate to be horizontal
  snowGround.rotation.x = -Math.PI / 2

  // Position outside the wall with window (x = -roomSize/2 - 7.5)
  snowGround.position.set(-roomSize / 2 - 7.5, 0, 0)
  snowGround.receiveShadow = true
  scene.add(snowGround)

  // ============================================================
  // CHRISTMAS TREES - Multiple decorated trees
  // ============================================================

  // Define positions for 5 trees (visible through window centered at z=0)
  const treePositions = [
    { x: -roomSize / 2 - 3, z: -2 },
    { x: -roomSize / 2 - 5, z: 1 },
    { x: -roomSize / 2 - 4, z: 3 },
    { x: -roomSize / 2 - 6, z: -1 },
    { x: -roomSize / 2 - 7, z: 2 }
  ]

  // Create each tree with random size variation
  treePositions.forEach((pos) => {
    const treeScale = 1.5 + Math.random() * 0.5 // Random 1.5-2.0
    createChristmasTree(scene, pos.x, pos.z, treeScale)
  })

  // ============================================================
  // FALLING SNOWFLAKES - Animated particles
  // ============================================================

  for (let i = 0; i < 50; i++) {
    // Small white sphere for each snowflake
    const snowflakeGeometry = new THREE.SphereGeometry(0.05, 6, 6)
    const snowflakeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF // White
    })
    const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial)

    // Random starting position in the garden area
    snowflake.position.set(
      -roomSize / 2 - 3 - Math.random() * 8, // X: spread across garden
      Math.random() * 10 + 2,                  // Y: various heights
      -4 + Math.random() * 8                   // Z: spread front to back
    )

    // Store animation parameters in userData
    // userData is a standard Three.js property for custom data
    snowflake.userData.fallSpeed = 0.01 + Math.random() * 0.02  // 0.01-0.03
    snowflake.userData.sway = Math.random() * 0.01               // Horizontal drift
    snowflake.userData.swayOffset = Math.random() * Math.PI * 2  // Random phase

    snowflakes.push(snowflake)
    scene.add(snowflake)
  }

  return snowflakes
}

/**
 * Creates a single decorated Christmas tree
 *
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} x - X position
 * @param {number} z - Z position
 * @param {number} scale - Size multiplier (default: 1.5)
 *
 * Tree components:
 * - Brown trunk (cylinder)
 * - 3 stacked green cones (foliage)
 * - White cone caps (snow)
 * - Gold star on top
 * - Colored lights (red, green, blue, yellow, magenta)
 */
function createChristmasTree(scene, x, z, scale = 1.5) {
  // ============================================================
  // TREE TRUNK - Brown wooden base
  // ============================================================

  const trunkGeometry = new THREE.CylinderGeometry(
    0.1 * scale,  // Top radius
    0.12 * scale, // Bottom radius (slightly wider)
    0.4 * scale,  // Height
    8             // Segments (8-sided cylinder)
  )
  const trunkMaterial = new THREE.MeshLambertMaterial({
    color: 0x4A3728 // Dark brown
  })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.set(x, 0.2 * scale, z) // Half of height above ground
  trunk.castShadow = true
  scene.add(trunk)

  // ============================================================
  // TREE FOLIAGE - 3 stacked green cones
  // ============================================================

  const foliageMaterial = new THREE.MeshLambertMaterial({
    color: 0x0D5F0D // Dark green
  })

  // Bottom cone (largest)
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

  // Top cone (smallest)
  const cone3Geometry = new THREE.ConeGeometry(0.4 * scale, 0.8 * scale, 8)
  const cone3 = new THREE.Mesh(cone3Geometry, foliageMaterial)
  cone3.position.set(x, 1.9 * scale, z)
  cone3.castShadow = true
  scene.add(cone3)

  // ============================================================
  // STAR - Gold star on top
  // ============================================================

  const starGeometry = new THREE.SphereGeometry(0.1 * scale, 5, 5)
  const starMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFD700,      // Gold color
    emissive: 0xFFAA00,   // Glowing effect
    emissiveIntensity: 0.5 // Glow strength
  })
  const star = new THREE.Mesh(starGeometry, starMaterial)
  star.position.set(x, 2.5 * scale, z)
  scene.add(star)

  // ============================================================
  // SNOW ON TREE - White cone caps
  // ============================================================

  const snowMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF // Pure white
  })

  // Snow on bottom tier
  const snow1 = new THREE.Mesh(
    new THREE.ConeGeometry(0.62 * scale, 0.3 * scale, 8),
    snowMaterial
  )
  snow1.position.set(x, 1.3 * scale, z)
  scene.add(snow1)

  // Snow on middle tier
  const snow2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.52 * scale, 0.25 * scale, 8),
    snowMaterial
  )
  snow2.position.set(x, 1.85 * scale, z)
  scene.add(snow2)

  // ============================================================
  // CHRISTMAS LIGHTS - Colored spheres spiraling around tree
  // ============================================================

  // Array of festive colors
  const lightColors = [
    0xFF0000, // Red
    0x00FF00, // Green
    0x0000FF, // Blue
    0xFFFF00, // Yellow
    0xFF00FF  // Magenta
  ]

  // Create 8 lights spiraling around the tree
  for (let i = 0; i < 8; i++) {
    const lightGeometry = new THREE.SphereGeometry(0.05 * scale, 4, 4)

    // Cycle through colors
    const color = lightColors[i % lightColors.length]

    const lightMaterial = new THREE.MeshLambertMaterial({
      color: color,
      emissive: color,        // Make it glow
      emissiveIntensity: 0.3  // Subtle glow
    })

    const light = new THREE.Mesh(lightGeometry, lightMaterial)

    // Position lights in a spiral pattern
    // angle increases with i to go around the tree
    // radius decreases with i to follow the cone shape
    // height increases with i to go up the tree
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
 * Animates falling snowflakes
 *
 * @param {Array<THREE.Mesh>} snowflakes - Array of snowflake meshes
 * @param {number} roomSize - Size of the room
 *
 * Call this function every frame in your animation loop.
 * Each snowflake:
 * - Falls downward at its own speed
 * - Sways left/right using sine wave
 * - Resets to top when it hits the ground
 */
export function animateSnowflakes(snowflakes, roomSize) {
  snowflakes.forEach((snowflake) => {
    // Move snowflake downward based on its fall speed
    snowflake.position.y -= snowflake.userData.fallSpeed

    // Add horizontal sway using sine wave
    // Date.now() provides current time for continuous animation
    // swayOffset makes each snowflake sway differently
    snowflake.position.x += Math.sin(
      Date.now() * 0.001 + snowflake.userData.swayOffset
    ) * snowflake.userData.sway

    // Reset snowflake to top when it hits the ground
    if (snowflake.position.y < 0) {
      snowflake.position.y = 10 + Math.random() * 2 // Random height 10-12
      snowflake.position.x = -roomSize / 2 - 3 - Math.random() * 8
      snowflake.position.z = -4 + Math.random() * 8
    }
  })
}
