/**
 * Smoke Particles Module
 *
 * Creates and animates smoke puffs from Thomas's chimney.
 *
 * For Three.js beginners:
 * - Particle systems create many small objects for effects
 * - Transparent materials let objects fade in/out
 * - Opacity ranges from 0 (invisible) to 1 (solid)
 * - Scaling makes objects bigger/smaller over time
 * - Lifetime tracking creates a cycle: emit → rise → fade → reset
 */

import * as THREE from 'three'

/**
 * Creates smoke particle system
 *
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} particleCount - Number of smoke particles (default: 15)
 * @returns {Array<THREE.Mesh>} Array of smoke particle meshes
 *
 * Each particle:
 * - Starts at the chimney
 * - Rises upward
 * - Expands in size
 * - Drifts sideways
 * - Fades out
 * - Resets and repeats
 *
 * The smoke particles are staggered in time so they emit continuously
 * rather than all at once.
 */
export function createSmokeParticles(scene, particleCount = 15) {
  const smokeParticles = []

  for (let i = 0; i < particleCount; i++) {
    // Create small sphere for smoke puff
    const smokeGeometry = new THREE.SphereGeometry(0.08, 8, 8)

    // Transparent material that can fade in/out
    const smokeMaterial = new THREE.MeshLambertMaterial({
      color: 0xAAAAAA,    // Light gray
      transparent: true,  // Enable transparency
      opacity: 0.6        // Starting opacity (0=invisible, 1=solid)
    })

    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial)

    // Store animation data in userData
    // Each particle has a random start time to stagger emissions
    smoke.userData.lifetime = Math.random() * 2  // Random 0-2 seconds
    smoke.userData.maxLifetime = 2               // 2 second lifetime before reset
    smoke.userData.initialScale = 1.0            // Starting size

    smokeParticles.push(smoke)
    scene.add(smoke)
  }

  return smokeParticles
}

/**
 * Animates smoke particles rising from the train's funnel
 *
 * @param {Array<THREE.Mesh>} smokeParticles - Array of smoke meshes
 * @param {THREE.Group} train - The train group (to get funnel position)
 * @param {number} deltaTime - Time since last frame (default: 0.016 for 60fps)
 *
 * Animation cycle:
 * 1. Particle emits from funnel (lifetime = 0)
 * 2. Rises upward, expands, and drifts
 * 3. Fades out as opacity decreases
 * 4. When lifetime reaches max, reset to step 1
 *
 * Call this function every frame in your animation loop
 */
export function animateSmokeParticles(smokeParticles, train, deltaTime = 0.016) {
  if (!train) return

  smokeParticles.forEach((smoke, index) => {
    // Increment lifetime (age of this particle)
    smoke.userData.lifetime += deltaTime

    // Check if particle has completed its lifecycle
    if (smoke.userData.lifetime >= smoke.userData.maxLifetime) {
      // === RESET PARTICLE ===
      // Move back to chimney and start over

      smoke.userData.lifetime = 0

      // Calculate funnel position in world space
      // The funnel is at relative position (0.3, 1.12, 0) before train rotation
      // After train rotates 90°, coordinates become (0, 1.12, -0.3)
      const funnelOffset = new THREE.Vector3(0, 1.12, -0.3)

      // Apply train's transformation matrix to get world coordinates
      // This accounts for train's position and rotation
      funnelOffset.applyMatrix4(train.matrix)

      // Set smoke position to funnel top
      smoke.position.copy(train.position).add(funnelOffset)

      // Reset size and opacity
      smoke.scale.set(1, 1, 1)
      smoke.material.opacity = 0.6

    } else {
      // === ANIMATE PARTICLE ===
      // Particle is active, make it rise and fade

      // Calculate progress (0 at birth, 1 at death)
      const progress = smoke.userData.lifetime / smoke.userData.maxLifetime

      // Move upward (rise from chimney)
      smoke.position.y += 0.015

      // Add horizontal drift (sway effect)
      // Using sine/cosine with index creates varied patterns
      smoke.position.x += Math.sin(Date.now() * 0.002 + index) * 0.005
      smoke.position.z += Math.cos(Date.now() * 0.002 + index) * 0.005

      // Expand as smoke rises (starts at 1x, ends at 3x size)
      const scale = 1 + progress * 2
      smoke.scale.set(scale, scale, scale)

      // Fade out (opacity goes from 0.6 to 0)
      smoke.material.opacity = 0.6 * (1 - progress)
    }
  })
}

/**
 * Helper function to get funnel world position
 *
 * @param {THREE.Group} train - The train group
 * @returns {THREE.Vector3} World position of funnel top
 *
 * Useful for placing other effects at the chimney location.
 * Accounts for train's position and 90° rotation.
 */
export function getFunnelPosition(train) {
  if (!train) return new THREE.Vector3(0, 0, 0)

  // Funnel offset after 90° Y-axis rotation
  const funnelOffset = new THREE.Vector3(0, 1.12, -0.3)
  funnelOffset.applyMatrix4(train.matrix)

  return train.position.clone().add(funnelOffset)
}
