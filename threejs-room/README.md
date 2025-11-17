# Three.js Isometric Room - Vue 3 Project

A complete Vue 3 + Three.js project showcasing an isometric view of a cozy cubic room with vibrant colors and a window.

## Features

- **Vue 3 Composition API**: Modern Vue.js framework with script setup syntax
- **Three.js Integration**: WebGL-based 3D rendering
- **Isometric Perspective**: OrthographicCamera positioned at (10, 10, 10)
- **Cozy Room Design**:
  - Soft orange floor (#FFA07A)
  - Deep blue back wall (#4682B4)
  - Sunny yellow left wall (#FFD700) with a window cutout
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

### Room Dimensions
- **Size**: 10 x 10 x 10 units
- **Floor**: Horizontal plane at y=0
- **Back Wall**: Vertical plane at z=-5
- **Left Wall**: Vertical plane at x=-5 with window cutout

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
- **Colors**: Vibrant and warm (orange, blue, yellow)
- **Sides**: DoubleSide rendering for visibility

## Customization

You can easily customize the room by modifying `src/components/IsometricRoom.vue`:

- **Colors**: Change the hex values in the material definitions
- **Room Size**: Adjust the `ROOM_SIZE` constant
- **Camera Position**: Modify `camera.position.set(x, y, z)`
- **Window Size/Position**: Update `windowWidth`, `windowHeight`, `windowX`, `windowY`
- **Lighting**: Adjust light intensities and positions

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

Created as a demonstration of Three.js integration with Vue 3, featuring an isometric room design with warm, cozy aesthetics.
