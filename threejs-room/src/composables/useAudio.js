/**
 * Audio Composable
 *
 * Vue 3 composable for managing audio in the Three.js scene.
 *
 * For Three.js/Vue beginners:
 * - Composables are reusable Vue logic (similar to React hooks)
 * - Web Audio API creates synthesized sounds
 * - HTML5 Audio element plays music files
 * - ref() creates reactive variables that update the UI
 */

import { ref, onUnmounted } from 'vue'

/**
 * Creates and manages audio controls
 *
 * @returns {Object} Audio controls and functions
 *
 * Provides:
 * - Music playback controls (play/pause/volume)
 * - Sound effect functions (jingle bells, train whistle)
 * - Reactive state for UI binding
 */
export function useAudio() {
  // ============================================================
  // REACTIVE STATE
  // ============================================================
  // These ref() values automatically update the UI when changed

  const isMusicPlaying = ref(false)  // Is music currently playing?
  const musicVolume = ref(50)        // Volume 0-100
  const christmasMusic = ref(null)   // Reference to audio element

  // ============================================================
  // WEB AUDIO API SETUP
  // ============================================================
  // AudioContext is used for synthesizing sound effects

  let audioContext = null

  // Initialize audio context (do this on user interaction)
  function initAudioContext() {
    if (!audioContext) {
      // Create cross-browser AudioContext
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContext
  }

  // ============================================================
  // MUSIC CONTROLS (HTML5 Audio)
  // ============================================================

  /**
   * Toggle music play/pause
   *
   * HTML5 Audio element must be played in response to user interaction
   * (browsers block autoplay to prevent annoying users)
   */
  function toggleMusic() {
    if (!christmasMusic.value) return

    if (isMusicPlaying.value) {
      // Currently playing → pause it
      christmasMusic.value.pause()
      isMusicPlaying.value = false
    } else {
      // Currently paused → play it
      christmasMusic.value.play().catch(err => {
        console.log('Audio play error:', err)
        // Common errors:
        // - User hasn't interacted with page yet
        // - Audio file failed to load
      })
      isMusicPlaying.value = true
    }
  }

  /**
   * Update music volume
   *
   * HTML5 Audio volume ranges from 0.0 to 1.0
   * Our UI uses 0-100, so we divide by 100
   */
  function updateVolume() {
    if (christmasMusic.value) {
      christmasMusic.value.volume = musicVolume.value / 100
    }
  }

  /**
   * Set initial volume when audio element is ready
   *
   * @param {HTMLAudioElement} audioElement - The audio element ref
   */
  function setMusicRef(audioElement) {
    christmasMusic.value = audioElement
    if (audioElement) {
      audioElement.volume = musicVolume.value / 100
    }
  }

  // ============================================================
  // SOUND EFFECTS (Web Audio API)
  // ============================================================

  /**
   * Play jingle bell sound effect
   *
   * Creates a bell-like sound using three sine wave oscillators
   * at different frequencies (creating a chord).
   *
   * How it works:
   * 1. Creates three oscillators (tone generators)
   * 2. Sets frequencies for C major chord (800, 1000, 1200 Hz)
   * 3. Applies volume envelope (quick attack, long decay)
   * 4. Plays them with slight delays for bell-like effect
   */
  function playJingleBell() {
    const ctx = initAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Three frequencies create a pleasant chord
    const frequencies = [800, 1000, 1200]

    frequencies.forEach((freq, index) => {
      // Oscillator generates the tone
      const oscillator = ctx.createOscillator()

      // GainNode controls volume
      const gainNode = ctx.createGain()

      // Connect: Oscillator → Gain → Speakers
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Set frequency and waveform
      oscillator.frequency.value = freq
      oscillator.type = 'sine' // Smooth, pure tone

      // Volume envelope (how volume changes over time)
      // Bells have quick attack and long decay
      gainNode.gain.setValueAtTime(0, now)                      // Start silent
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01)   // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5) // Long decay

      // Start each note with slight delay (creates arpeggio effect)
      oscillator.start(now + index * 0.05)
      oscillator.stop(now + 0.6) // Stop after 0.6 seconds
    })
  }

  /**
   * Play train whistle sound effect
   *
   * Creates a falling pitch sound like a steam train whistle.
   *
   * How it works:
   * 1. Creates one oscillator
   * 2. Starts at 650 Hz and drops to 550 Hz (pitch drop)
   * 3. Volume fades in, holds, then fades out
   */
  function playTrainWhistle() {
    const ctx = initAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Train whistles are in the 500-700 Hz range
    oscillator.frequency.setValueAtTime(650, now)              // Start pitch
    oscillator.frequency.linearRampToValueAtTime(550, now + 0.5) // End pitch (lower)

    oscillator.type = 'sine'

    // Volume envelope: fade in, hold, fade out
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.1)   // Fade in
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.4)   // Hold
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8) // Fade out

    oscillator.start(now)
    oscillator.stop(now + 0.8)
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  /**
   * Clean up audio resources when component unmounts
   *
   * Important to prevent memory leaks and audio glitches
   */
  function cleanup() {
    // Stop music
    if (christmasMusic.value) {
      christmasMusic.value.pause()
      christmasMusic.value = null
    }

    // Close audio context
    if (audioContext) {
      audioContext.close()
      audioContext = null
    }
  }

  // Automatically cleanup when Vue component unmounts
  onUnmounted(cleanup)

  // ============================================================
  // RETURN PUBLIC API
  // ============================================================

  return {
    // Reactive state (for UI binding)
    isMusicPlaying,
    musicVolume,
    christmasMusic,

    // Functions
    toggleMusic,
    updateVolume,
    setMusicRef,
    playJingleBell,
    playTrainWhistle,
    initAudioContext,
    cleanup
  }
}
