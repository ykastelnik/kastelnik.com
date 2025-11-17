# Three.js Isometric Room - Vue 3 Project (Thomas the Train Edition)

A complete Vue 3 + Three.js project showcasing Thomas the Train's railway shed with an isometric view, procedural brick textures, and railway tracks.

## Features

- **Vue 3 Composition API**: Modern Vue.js framework with script setup syntax
- **Three.js Integration**: WebGL-based 3D rendering
- **Isometric Perspective**: OrthographicCamera positioned at (10, 10, 10)
- **Interactive Controls**: OrbitControls for camera movement (rotate, pan, zoom)
- **Thomas the Train Railway Shed Theme**:
  - Railway gray concrete floor (#808080)
  - Thomas blue brick wall (#0066B3) with procedural texture
  - Red brick wall (#8B3A3A) with procedural texture
  - Functional railway tracks with rails and sleepers (ties)
- **Procedural Textures**: Canvas-based brick texture generator
- **Window**: Rectangular cutout with decorative brown frame
- **Lighting**: Ambient light (0.5 intensity) + Directional light (1.0 intensity) with soft shadows
- **Responsive**: Handles window resizing automatically
- **Optimized**: Clean animation loop with proper resource cleanup

## Project Structure

```
threejs-room/
├── index.html                      # Entry HTML file
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── src/
    ├── main.js                     # Vue app initialization
    ├── App.vue                     # Root Vue component
    └── components/
        └── IsometricRoom.vue       # Main Three.js component
```

## Installation

1. Navigate to the project directory:
   ```bash
   cd threejs-room
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Key Implementation Details

### Camera Setup
- **Type**: OrthographicCamera (for isometric view)
- **Position**: (10, 10, 10)
- **Looking at**: Scene center (0, 0, 0)
- **Frustum size**: 15 units (adjustable for zoom)

### Interactive Controls
- **OrbitControls**: Mouse/touch-based camera manipulation
- **Left-click drag**: Rotate camera around the scene
- **Right-click drag**: Pan the view
- **Scroll wheel**: Zoom in/out (min: 5 units, max: 50 units)
- **Damping**: Smooth camera movements enabled (factor: 0.05)
- **Max polar angle**: π/2 (prevents camera going below ground)

### Railway Shed Design
- **Size**: 10 x 10 x 10 units
- **Floor**: Railway gray concrete (#808080) with railroad tracks
- **Back Wall**: Thomas blue brick (#0066B3) with procedural texture
- **Left Wall**: Red brick (#8B3A3A) with procedural texture and window cutout
- **Railway Tracks**:
  - Two parallel rails (dark gray, 0.15 × 0.1 × 10 units)
  - Wooden sleepers (brown, spaced 0.8 units apart)

### Procedural Brick Texture
- **Canvas size**: 512 × 512 pixels
- **Brick dimensions**: 100 × 40 pixels
- **Mortar width**: 4 pixels
- **Pattern**: Offset brick layout for realistic appearance
- **Wrapping**: Repeating texture (2× repeat on both axes)

### Window Specifications
- **Dimensions**: 3 units wide × 4 units tall
- **Position**: Offset at (1, 3) on the left wall
- **Frame**: Brown (#8B4513) decorative border
- **Background**: Sky blue scene background (#87CEEB) visible through window

### Lighting Configuration
- **Ambient Light**: White (0xffffff), intensity 0.5
- **Directional Light**: White (0xffffff), intensity 1.0, positioned at (5, 10, 5)
- **Shadows**: Enabled with PCF soft shadow mapping

### Materials
- **Type**: MeshLambertMaterial (for subtle shading)
- **Textures**: Procedural brick textures using HTML5 Canvas
- **Railway elements**: Solid colors (gray rails, brown sleepers)
- **Sides**: DoubleSide rendering for visibility

## Customization

You can easily customize the room by modifying `src/components/IsometricRoom.vue`:

- **Brick Colors**: Change colors in `createBrickTexture()` calls
- **Room Size**: Adjust the `ROOM_SIZE` constant
- **Camera Position**: Modify `camera.position.set(x, y, z)`
- **Window Size/Position**: Update `windowWidth`, `windowHeight`, `windowX`, `windowY`
- **Lighting**: Adjust light intensities and positions
- **Railway Tracks**: Modify track spacing, rail size, or sleeper density
- **Controls**: Adjust `minDistance`, `maxDistance`, `dampingFactor` in OrbitControls setup

## Technologies Used

- **Vue 3** (^3.4.0) - Progressive JavaScript framework
- **Three.js** (^0.160.0) - 3D graphics library
- **Vite** (^5.0.0) - Next-generation frontend build tool
- **@vitejs/plugin-vue** (^5.0.0) - Official Vue plugin for Vite

## Browser Compatibility

Modern browsers with WebGL support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

## License

MIT

## Credits

Created as a demonstration of Three.js integration with Vue 3, featuring Thomas the Train's railway shed with procedural textures, interactive controls, and authentic railway elements. Inspired by the beloved children's series "Thomas the Tank Engine & Friends."
