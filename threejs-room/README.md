# Three.js Isometric Room - Vue 3 Project (Thomas the Train Christmas Edition)

A complete Vue 3 + Three.js project showcasing Thomas the Train's railway shed with an isometric view, Christmas decorations, animated snowfall, and interactive controls. **Designed with beginners in mind** - fully commented and modular code structure.

## 🎄 Features

- **Vue 3 Composition API**: Modern Vue.js framework with script setup syntax
- **Three.js Integration**: WebGL-based 3D rendering
- **Isometric Perspective**: OrthographicCamera for that classic isometric view
- **Interactive Controls**: OrbitControls + keyboard controls (WASD, arrows, Q/E)
- **Thomas the Train Railway Shed Theme**:
  - Railway gray concrete floor with functional tracks
  - Thomas blue brick wall with procedural texture
  - Red brick wall with window cutout and frame
  - Animated Thomas the Train on rails with rotating wheels
  - Smoke particles from chimney
- **Christmas Scene**:
  - Decorated Christmas trees with lights, snow, and stars
  - Animated falling snowflakes
  - Snowy garden visible through window
- **Audio System**:
  - Background music controls (play/pause, volume)
  - Web Audio API sound effects (jingle bells, train whistle)
- **Interactive Dashboard**: Control panel with real-time settings
- **Help Overlay**: Keyboard and mouse controls reference

## 📁 Project Structure (Modular & Beginner-Friendly)

```
threejs-room/
├── index.html                          # Entry HTML file
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration
├── README.md                           # This file
└── src/
    ├── main.js                         # Vue app initialization
    ├── App.vue                         # Root Vue component
    ├── components/
    │   └── IsometricRoom.vue          # Main orchestrator component
    ├── modules/                        # ✨ Modular Three.js code
    │   ├── room.js                    # Room creation (walls, floor, furniture)
    │   ├── thomas-train.js            # Thomas train model and wheel animation
    │   ├── christmas-garden.js        # Christmas trees and falling snow
    │   └── smoke-particles.js         # Smoke particle system
    └── composables/                    # Vue composables
        └── useAudio.js                # Audio controls (music & sound effects)
```

### Why This Structure?

Each module focuses on **one thing**:
- **Separation of Concerns**: Easy to find and modify specific features
- **Reusability**: Import and use modules in other projects
- **Beginner-Friendly**: Comprehensive comments explain Three.js concepts
- **Maintainability**: Changes to one module don't affect others

## 🚀 Installation

1. Navigate to the project directory:
   ```bash
   cd threejs-room
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🎮 Running the Project

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal)

## 📦 Build for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎯 Controls

### Mouse Controls
- **Left-click + Drag**: Rotate camera 360°
- **Right-click + Drag**: Pan view
- **Mouse Wheel**: Zoom in/out

### Keyboard Controls
- **W / Arrow Up**: Move forward
- **S / Arrow Down**: Move backward
- **A / Arrow Left**: Move left
- **D / Arrow Right**: Move right
- **Q**: Rotate camera left
- **E**: Rotate camera right
- **R**: Reset camera to initial position
- **H**: Toggle help overlay

### Dashboard Controls
- **Speed Slider**: Adjust camera movement speed
- **Music Button**: Play/pause Christmas music
- **Volume Slider**: Adjust music volume (0-100%)
- **Reset View Button**: Return camera to initial position
- **Help Button**: Show/hide controls reference

## 🔧 Code Modules Explained

### `modules/room.js`
Creates the room structure:
- **Floor**: Railway gray with tracks and sleepers
- **Walls**: Two brick walls forming an L-corner
- **Window**: Cutout with wooden frame
- **Furniture**: Coffee table with flower pot
- **Texture Generator**: Procedural brick patterns

**Key Function**: `createRoom(scene, roomSize)`

### `modules/thomas-train.js`
Creates and animates Thomas:
- **Train Model**: Body, cabin, face, funnel, wheels, buffers
- **Wheel Animation**: Rotating wheels synchronized with movement
- **Helper Functions**: Get funnel position for smoke

**Key Functions**:
- `createThomasTrain()` - Returns THREE.Group
- `animateTrainWheels(train, speed)` - Rotates wheels

### `modules/christmas-garden.js`
Creates the winter scene:
- **Snowy Ground**: White plane outside window
- **Christmas Trees**: Decorated with lights, snow, stars
- **Snowflakes**: 50 individual particles with unique properties
- **Snowflake Animation**: Falling, swaying, resetting

**Key Functions**:
- `createChristmasGarden(scene, roomSize)` - Returns snowflakes array
- `animateSnowflakes(snowflakes, roomSize)` - Animates falling

### `modules/smoke-particles.js`
Creates smoke effect:
- **Particle System**: 15 smoke puffs
- **Lifecycle**: Emit → Rise → Expand → Fade → Reset
- **Realistic Motion**: Upward movement with drift

**Key Functions**:
- `createSmokeParticles(scene, count)` - Returns particles array
- `animateSmokeParticles(particles, train)` - Animates smoke

### `composables/useAudio.js`
Manages all audio:
- **HTML5 Audio**: Background music playback
- **Web Audio API**: Synthesized sound effects
- **Reactive State**: Vue refs for UI binding
- **Volume Control**: 0-100% range

**Key Functions**:
- `toggleMusic()` - Play/pause music
- `updateVolume()` - Adjust volume
- `playJingleBell()` - Bell sound effect
- `playTrainWhistle()` - Train whistle sound

## 📚 Learning Resources

### For Three.js Beginners

Each module includes detailed comments explaining:
- **Basic Concepts**: What Three.js objects do (Scene, Camera, Mesh, etc.)
- **Geometry Types**: BoxGeometry, CylinderGeometry, SphereGeometry, etc.
- **Materials**: How MeshLambertMaterial responds to lighting
- **Transformations**: Position, rotation, and scale
- **Animation**: How to update objects every frame
- **Coordinate System**: X (left/right), Y (up/down), Z (forward/back)

### Recommended Reading Order

1. Start with `IsometricRoom.vue` - See how everything connects
2. Read `modules/room.js` - Learn basic meshes and textures
3. Read `modules/thomas-train.js` - Learn THREE.Group and composition
4. Read `modules/christmas-garden.js` - Learn particle systems
5. Read `modules/smoke-particles.js` - Learn advanced animation
6. Read `composables/useAudio.js` - Learn Web Audio API

## 🎨 Customization

### Change Colors
Edit hex colors in module files:
```javascript
// In room.js
const thomasBlue = 0x0066B3  // Change this!
```

### Adjust Room Size
```javascript
// In IsometricRoom.vue
const ROOM_SIZE = 10  // Make bigger or smaller
```

### Add More Trees
```javascript
// In christmas-garden.js
const treePositions = [
  { x: -10, z: 0 },  // Add more positions!
]
```

### Change Train Speed
```javascript
// In IsometricRoom.vue, animate() function
trainPosition += 0.02  // Increase for faster
```

## 🛠 Technologies Used

- **Vue 3** (^3.4.0) - Progressive JavaScript framework
- **Three.js** (^0.160.0) - 3D graphics library
- **Vite** (^5.0.0) - Next-generation frontend build tool
- **@vitejs/plugin-vue** (^5.0.0) - Official Vue plugin for Vite

## 🌐 Browser Compatibility

Modern browsers with WebGL support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

## 🤝 Contributing

This project is designed for learning! Feel free to:
- Add new features (trains, decorations, effects)
- Improve comments and documentation
- Create tutorials or walkthroughs
- Share your modifications

## 📄 License

MIT

## 🙏 Credits

Created as an educational demonstration of Three.js integration with Vue 3, featuring:
- Thomas the Tank Engine theme
- Modular, beginner-friendly code structure
- Comprehensive inline documentation
- Interactive Christmas scene

Inspired by the beloved children's series "Thomas the Tank Engine & Friends."

---

**Happy coding! 🚂🎄**

*For questions or issues, refer to the inline comments in the code modules.*
