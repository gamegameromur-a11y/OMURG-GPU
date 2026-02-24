# Socrop - Professional Mobile Photo Editor

## Overview
Socrop is a professional mobile photo editing application built with React Native and Expo. It features a dark theme UI inspired by Instagram/CapCut with comprehensive editing tools.

## Architecture
- **Framework**: React Native with Expo (Expo Router for navigation)
- **State Management**: React Context (EditorContext) with ref-based undo/redo history (80 steps)
- **Image Processing**: expo-image-manipulator for transforms and export
- **Drawing**: react-native-svg for brush strokes
- **Animations**: react-native-reanimated
- **Typography**: @expo-google-fonts/inter

## Project Structure
```
app/
  _layout.tsx         - Root layout with providers (fonts, editor context)
  index.tsx           - Home screen (gallery picker, camera)
  editor.tsx          - Main editor with canvas, overlays, drawing, tools
  export.tsx          - Export screen (format, quality, resolution, save)
components/
  AdjustmentSlider.tsx - Custom PanResponder slider with reset
  FilterStrip.tsx      - Categorized filter strip with intensity control
  ToolBar.tsx          - Editor tool selector (6 tools)
  CropPanel.tsx        - Aspect ratios + social media presets
  TransformPanel.tsx   - Rotate (90/45) + flip controls
  TextPanel.tsx        - Rich text overlay (17 sizes, italic, alignment, bg, spacing)
  DrawPanel.tsx        - Free brush drawing with color/width selection
  ErrorBoundary.tsx    - Error boundary component
  ErrorFallback.tsx    - Error fallback UI
constants/
  colors.ts           - Dark theme color palette
  filters.ts          - 30 categorized filter presets + crop ratios
  adjustments.ts      - 12 adjustment slider configurations
context/
  EditorContext.tsx    - Editor state with ref-based undo/redo
server/
  index.ts            - Express backend
  routes.ts           - API routes
```

## Key Features
- Image picking from gallery or camera
- 12 adjustment sliders (exposure, brightness, contrast, saturation, warmth, tint, highlights, shadows, sharpness, vignette, grain, fade)
- 30 categorized filter presets with intensity slider (Color, Warm, Cool, Mono, Film, Vintage, Soft, Dark)
- Crop with 10 aspect ratios + 6 social media presets (Instagram, YouTube, Pinterest, etc.)
- Rotate (90/45 degrees) and flip transforms
- Rich text overlays: 17 font sizes (10-72pt), bold/italic, alignment, letter spacing, text shadow, background color, 22 text colors
- Free brush drawing with SVG polylines, 7 brush sizes, 12 colors
- Undo/redo system (80 steps, ref-based)
- Export with format (JPG/PNG/WEBP), 4 quality levels, 6 resolution options
- Save to device gallery
- No subscriptions or payments

## Design
- Dark theme: background #0D0D0D, surface #1A1A1A
- Accent color: #00D4AA (cyan/teal)
- Instagram/CapCut inspired UI
- Inter font family (400/500/600/700)

## Dependencies
- expo-image-manipulator: Image processing
- expo-media-library: Save to gallery
- expo-crypto: UUID generation
- expo-image-picker: Photo selection
- @expo-google-fonts/inter: Typography
- react-native-reanimated: Animations
- react-native-svg: Drawing paths
- expo-haptics: Tactile feedback
- expo-linear-gradient: Gradient backgrounds
