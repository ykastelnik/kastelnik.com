/**
 * Thomas the Train Module
 *
 * This module creates and animates Thomas the Tank Engine.
 *
 * For Three.js beginners:
 * - THREE.Group lets you combine multiple meshes into one object
 * - This makes it easy to move, rotate, or scale everything together
 * - Child meshes maintain their relative positions within the group
 * - Rotation.y rotates around vertical axis (yaw)
 * - Position.z moves along the tracks (forward/backward in our scene)
 */

import * as THREE from 'three'

/**
 * Creates Thomas the Train as a THREE.Group
 *
 * @returns {THREE.Group} A group containing all train parts
 *
 * Components:
 * - Blue cylindrical body (boiler)
 * - Driver's cabin (blue box)
 * - Roof
 * - Face (circular with eyes and smile)
 * - Black funnel/chimney with red rim
 * - 6 wheels (3 per side) with red hubs
 * - Front buffers (red cylinders)
 *
 * The train is built facing along the positive X-axis,
 * then rotated 90° to align with the Z-axis tracks
 */
export function createThomasTrain() {
  // THREE.Group acts as a container for all train parts
  // This lets us move/rotate the entire train as one unit
  const train = new THREE.Group()

  // Thomas blue color (official Thomas the Tank Engine color)
  const thomasBlue = 0x0066B3

  // ============================================================
  // MAIN BODY - Horizontal cylindrical boiler
  // ============================================================

  // CylinderGeometry(radiusTop, radiusBottom, height, segments)
  // By default, cylinders are vertical, so we rotate it
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16)
  const bodyMaterial = new THREE.MeshLambertMaterial({
    color: thomasBlue
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)

  // Rotate 90° around Z-axis to make it horizontal
  body.rotation.z = Math.PI / 2
  body.position.set(0, 0.5, 0)
  body.castShadow = true
  train.add(body)

  // ============================================================
  // DRIVER'S CAB - The blue cabin where the driver sits
  // ============================================================

  const cabGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.6)
  const cabMaterial = new THREE.MeshLambertMaterial({
    color: thomasBlue
  })
  const cab = new THREE.Mesh(cabGeometry, cabMaterial)
  cab.position.set(-0.5, 0.5, 0) // Behind the main body
  cab.castShadow = true
  train.add(cab)

  // ============================================================
  // CAB ROOF
  // ============================================================

  const roofGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.7)
  const roofMaterial = new THREE.MeshLambertMaterial({
    color: thomasBlue
  })
  const roof = new THREE.Mesh(roofGeometry, roofMaterial)
  roof.position.set(-0.5, 0.85, 0) // On top of cab
  train.add(roof)

  // ============================================================
  // THOMAS'S FACE - Circular face on the front
  // ============================================================

  // CircleGeometry creates a flat circle (2D shape)
  const faceGeometry = new THREE.CircleGeometry(0.25, 16)
  const faceMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFE4C4 // Beige/tan skin color
  })
  const face = new THREE.Mesh(faceGeometry, faceMaterial)
  face.position.set(0.61, 0.5, 0) // Front of train
  face.rotation.y = Math.PI / 2 // Rotate to face forward
  train.add(face)

  // ============================================================
  // EYES - Two black circles
  // ============================================================

  const eyeGeometry = new THREE.CircleGeometry(0.06, 16)
  const eyeMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000 // Black
  })

  // Left eye
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
  leftEye.position.set(0.62, 0.55, -0.08) // Above center, left side
  leftEye.rotation.y = Math.PI / 2
  train.add(leftEye)

  // Right eye
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
  rightEye.position.set(0.62, 0.55, 0.08) // Above center, right side
  rightEye.rotation.y = Math.PI / 2
  train.add(rightEye)

  // ============================================================
  // SMILE - Half-circle curve
  // ============================================================

  // TorusGeometry creates a donut shape
  // We use half of it (Math.PI radians) to make a smile
  const smileGeometry = new THREE.TorusGeometry(
    0.08, // Ring radius
    0.02, // Tube thickness
    8,    // Radial segments
    16,   // Tubular segments
    Math.PI // Arc length (half circle)
  )
  const smileMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000 // Black
  })
  const smile = new THREE.Mesh(smileGeometry, smileMaterial)
  smile.position.set(0.62, 0.42, 0) // Below eyes
  smile.rotation.set(0, Math.PI / 2, 0) // Orient correctly
  train.add(smile)

  // ============================================================
  // FUNNEL/CHIMNEY - Black smokestack with red rim
  // ============================================================

  const funnelGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 16)
  const funnelMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000 // Black
  })
  const funnel = new THREE.Mesh(funnelGeometry, funnelMaterial)
  funnel.position.set(0.3, 0.95, 0) // On top of body
  train.add(funnel)

  // Red rim at top of funnel
  const funnelTopGeometry = new THREE.CylinderGeometry(0.11, 0.08, 0.05, 16)
  const funnelTopMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF0000 // Red
  })
  const funnelTop = new THREE.Mesh(funnelTopGeometry, funnelTopMaterial)
  funnelTop.position.set(0.3, 1.12, 0) // Top of funnel
  train.add(funnelTop)

  // ============================================================
  // WHEELS - 6 wheels total (3 on each side)
  // ============================================================

  const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16)
  const wheelMaterial = new THREE.MeshLambertMaterial({
    color: 0x333333 // Dark gray
  })

  // Define wheel positions (3 along X-axis, 2 Z positions for left/right)
  const wheelPositions = [
    { x: 0.5, z: -0.4 },  // Front left
    { x: 0, z: -0.4 },    // Middle left
    { x: -0.5, z: -0.4 }, // Back left
    { x: 0.5, z: 0.4 },   // Front right
    { x: 0, z: 0.4 },     // Middle right
    { x: -0.5, z: 0.4 }   // Back right
  ]

  wheelPositions.forEach(pos => {
    // Create wheel
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    // Rotate to be perpendicular to ground
    wheel.rotation.x = Math.PI / 2
    wheel.position.set(pos.x, 0.15, pos.z)
    wheel.castShadow = true
    train.add(wheel)

    // Add red hub in center of wheel for detail
    const hubGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16)
    const hubMaterial = new THREE.MeshLambertMaterial({
      color: 0xFF0000 // Red
    })
    const hub = new THREE.Mesh(hubGeometry, hubMaterial)
    hub.rotation.x = Math.PI / 2
    hub.position.set(pos.x, 0.15, pos.z)
    train.add(hub)
  })

  // ============================================================
  // BUFFERS - Red cylinders on the front (shock absorbers)
  // ============================================================

  const bufferGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16)
  const bufferMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF0000 // Red
  })

  // Front left buffer
  const frontBuffer1 = new THREE.Mesh(bufferGeometry, bufferMaterial)
  frontBuffer1.rotation.z = Math.PI / 2 // Horizontal
  frontBuffer1.position.set(0.75, 0.3, -0.15)
  train.add(frontBuffer1)

  // Front right buffer
  const frontBuffer2 = new THREE.Mesh(bufferGeometry, bufferMaterial)
  frontBuffer2.rotation.z = Math.PI / 2
  frontBuffer2.position.set(0.75, 0.3, 0.15)
  train.add(frontBuffer2)

  // Return the complete train group
  return train
}

/**
 * Animates the train wheels by rotating them
 *
 * @param {THREE.Group} train - The train group to animate
 * @param {number} rotationSpeed - How fast to rotate (default: 0.1)
 *
 * This function should be called every frame in your animation loop.
 * It finds all wheel meshes and rotates them to simulate movement.
 *
 * How it identifies wheels:
 * - Looks for CylinderGeometry (wheels are cylinders)
 * - Checks for dark gray color (0x333333)
 * - Rotates around X-axis to simulate rolling
 */
export function animateTrainWheels(train, rotationSpeed = 0.1) {
  if (!train) return

  // Iterate through all children of the train group
  train.children.forEach(child => {
    // Check if this child is a wheel by checking geometry type and color
    if (
      child.geometry &&
      child.geometry.type === 'CylinderGeometry' &&
      child.material.color.getHex() === 0x333333 // Dark gray wheels
    ) {
      // Rotate wheel around X-axis to simulate rolling
      child.rotation.x += rotationSpeed
    }
  })
}

/**
 * Gets the funnel position for smoke particle emission
 *
 * @param {THREE.Group} train - The train group
 * @returns {THREE.Vector3} World position of the funnel top
 *
 * The funnel (chimney) is where smoke should emit from.
 * This function calculates its world position accounting for:
 * - Train's current position
 * - Train's rotation
 * - Funnel's relative position within the train group
 */
export function getFunnelWorldPosition(train) {
  if (!train) return new THREE.Vector3(0, 0, 0)

  // Funnel's position relative to train center (before 90° rotation)
  // After train.rotation.y = Math.PI/2, coordinates transform:
  // Original: x=0.3, y=1.12, z=0
  // After rotation: x=0, y=1.12, z=-0.3
  const funnelOffset = new THREE.Vector3(0, 1.12, -0.3)

  // Apply train's transformation matrix to get world position
  funnelOffset.applyMatrix4(train.matrix)

  // Add train's position
  return train.position.clone().add(funnelOffset)
}
