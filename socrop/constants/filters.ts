export interface FilterPreset {
  id: string;
  name: string;
  category: string;
  overlayColor: string;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    warmth: number;
    sharpness: number;
    highlights: number;
    shadows: number;
    vignette: number;
    grain: number;
    fade: number;
    tint: number;
    exposure: number;
  };
}

const base = { brightness: 0, contrast: 0, saturation: 0, warmth: 0, sharpness: 0, highlights: 0, shadows: 0, vignette: 0, grain: 0, fade: 0, tint: 0, exposure: 0 };

export const filterPresets: FilterPreset[] = [
  {
    id: "original", name: "Original", category: "Basic",
    overlayColor: "transparent",
    adjustments: { ...base },
  },
  {
    id: "vivid", name: "Vivid", category: "Color",
    overlayColor: "rgba(255, 100, 50, 0.06)",
    adjustments: { ...base, brightness: 5, contrast: 15, saturation: 35, exposure: 5, sharpness: 10 },
  },
  {
    id: "warm_glow", name: "Warm Glow", category: "Warm",
    overlayColor: "rgba(255, 160, 50, 0.12)",
    adjustments: { ...base, brightness: 8, contrast: 5, saturation: 10, warmth: 35, highlights: 15, exposure: 5 },
  },
  {
    id: "cool_breeze", name: "Cool", category: "Cool",
    overlayColor: "rgba(50, 130, 255, 0.1)",
    adjustments: { ...base, brightness: 3, contrast: 8, saturation: 5, warmth: -30, sharpness: 5, tint: -15 },
  },
  {
    id: "bw_classic", name: "B&W", category: "Mono",
    overlayColor: "rgba(0, 0, 0, 0.05)",
    adjustments: { ...base, saturation: -100, contrast: 20, sharpness: 15, highlights: 10, shadows: -10 },
  },
  {
    id: "cinematic", name: "Cinema", category: "Film",
    overlayColor: "rgba(20, 30, 80, 0.15)",
    adjustments: { ...base, brightness: -5, contrast: 25, saturation: -15, warmth: 10, shadows: -20, vignette: 30, tint: 10 },
  },
  {
    id: "moody", name: "Moody", category: "Dark",
    overlayColor: "rgba(10, 10, 40, 0.18)",
    adjustments: { ...base, brightness: -12, contrast: 22, saturation: -20, warmth: -8, shadows: -25, vignette: 40, fade: 5 },
  },
  {
    id: "retro", name: "Retro", category: "Vintage",
    overlayColor: "rgba(200, 150, 80, 0.12)",
    adjustments: { ...base, brightness: 5, contrast: -8, saturation: -25, warmth: 25, fade: 20, grain: 15, vignette: 20 },
  },
  {
    id: "golden_hour", name: "Golden", category: "Warm",
    overlayColor: "rgba(255, 180, 30, 0.14)",
    adjustments: { ...base, brightness: 10, contrast: 10, saturation: 15, warmth: 40, highlights: 20, exposure: 8 },
  },
  {
    id: "fade_out", name: "Fade", category: "Film",
    overlayColor: "rgba(180, 180, 200, 0.08)",
    adjustments: { ...base, brightness: 10, contrast: -15, saturation: -20, fade: 35, highlights: 20, shadows: 20 },
  },
  {
    id: "noir", name: "Noir", category: "Mono",
    overlayColor: "rgba(0, 0, 0, 0.12)",
    adjustments: { ...base, brightness: -8, contrast: 40, saturation: -100, sharpness: 20, shadows: -30, vignette: 45 },
  },
  {
    id: "pastel", name: "Pastel", category: "Soft",
    overlayColor: "rgba(220, 200, 255, 0.1)",
    adjustments: { ...base, brightness: 15, contrast: -12, saturation: -15, warmth: 8, fade: 15, highlights: 25, tint: 10 },
  },
  {
    id: "dramatic", name: "Drama", category: "Dark",
    overlayColor: "rgba(30, 10, 50, 0.12)",
    adjustments: { ...base, brightness: -5, contrast: 35, saturation: 10, warmth: -10, sharpness: 15, shadows: -25, vignette: 30 },
  },
  {
    id: "sunset", name: "Sunset", category: "Warm",
    overlayColor: "rgba(255, 120, 40, 0.14)",
    adjustments: { ...base, brightness: 5, contrast: 10, saturation: 25, warmth: 45, highlights: 15, vignette: 15, tint: 15 },
  },
  {
    id: "arctic", name: "Arctic", category: "Cool",
    overlayColor: "rgba(100, 180, 255, 0.12)",
    adjustments: { ...base, brightness: 10, contrast: 5, saturation: -15, warmth: -40, sharpness: 10, highlights: 20, tint: -20 },
  },
  {
    id: "chrome", name: "Chrome", category: "Color",
    overlayColor: "rgba(200, 220, 255, 0.06)",
    adjustments: { ...base, brightness: 5, contrast: 18, saturation: 8, sharpness: 25, highlights: 15, shadows: -10, exposure: 3 },
  },
  {
    id: "lomo", name: "Lomo", category: "Film",
    overlayColor: "rgba(180, 100, 50, 0.1)",
    adjustments: { ...base, contrast: 25, saturation: 30, warmth: 15, shadows: -15, vignette: 45, grain: 10 },
  },
  {
    id: "sepia", name: "Sepia", category: "Vintage",
    overlayColor: "rgba(180, 130, 70, 0.18)",
    adjustments: { ...base, brightness: 5, contrast: 5, saturation: -65, warmth: 40, fade: 10, vignette: 15, grain: 8 },
  },
  {
    id: "matte", name: "Matte", category: "Film",
    overlayColor: "rgba(200, 200, 200, 0.06)",
    adjustments: { ...base, brightness: 8, contrast: -8, saturation: -10, fade: 25, highlights: 15, shadows: 25 },
  },
  {
    id: "punch", name: "Punch", category: "Color",
    overlayColor: "rgba(255, 50, 50, 0.04)",
    adjustments: { ...base, contrast: 30, saturation: 40, sharpness: 15, highlights: 5, shadows: -15, exposure: 3 },
  },
  {
    id: "dreamy", name: "Dream", category: "Soft",
    overlayColor: "rgba(255, 220, 255, 0.08)",
    adjustments: { ...base, brightness: 12, contrast: -12, saturation: 5, warmth: 15, fade: 18, highlights: 25, tint: 15 },
  },
  {
    id: "urban", name: "Urban", category: "Dark",
    overlayColor: "rgba(40, 40, 60, 0.1)",
    adjustments: { ...base, brightness: -5, contrast: 18, saturation: -12, warmth: -5, sharpness: 12, vignette: 20, grain: 5 },
  },
  {
    id: "vintage", name: "Vintage", category: "Vintage",
    overlayColor: "rgba(160, 120, 60, 0.14)",
    adjustments: { ...base, brightness: 5, contrast: -8, saturation: -35, warmth: 30, fade: 20, vignette: 25, grain: 20 },
  },
  {
    id: "neon", name: "Neon", category: "Color",
    overlayColor: "rgba(120, 0, 255, 0.08)",
    adjustments: { ...base, contrast: 22, saturation: 45, warmth: -15, sharpness: 10, highlights: 10, tint: -25, exposure: 3 },
  },
  {
    id: "emerald", name: "Emerald", category: "Color",
    overlayColor: "rgba(0, 200, 100, 0.08)",
    adjustments: { ...base, brightness: 3, contrast: 10, saturation: 15, warmth: -10, tint: 20, highlights: 10 },
  },
  {
    id: "rose", name: "Rose", category: "Soft",
    overlayColor: "rgba(255, 100, 150, 0.1)",
    adjustments: { ...base, brightness: 8, contrast: -5, saturation: 5, warmth: 10, tint: 30, fade: 10, highlights: 15 },
  },
  {
    id: "midnight", name: "Midnight", category: "Dark",
    overlayColor: "rgba(10, 10, 50, 0.2)",
    adjustments: { ...base, brightness: -15, contrast: 20, saturation: -10, warmth: -20, shadows: -30, vignette: 50, tint: -10 },
  },
  {
    id: "sahara", name: "Sahara", category: "Warm",
    overlayColor: "rgba(200, 150, 50, 0.12)",
    adjustments: { ...base, brightness: 8, contrast: 8, saturation: -10, warmth: 35, grain: 10, fade: 8, vignette: 10 },
  },
  {
    id: "blueprint", name: "Blueprint", category: "Cool",
    overlayColor: "rgba(0, 80, 200, 0.12)",
    adjustments: { ...base, brightness: -3, contrast: 12, saturation: -20, warmth: -35, tint: -30, sharpness: 8, vignette: 15 },
  },
  {
    id: "portra", name: "Portra", category: "Film",
    overlayColor: "rgba(220, 180, 140, 0.08)",
    adjustments: { ...base, brightness: 5, contrast: -3, saturation: -5, warmth: 15, highlights: 10, shadows: 8, fade: 8, grain: 5 },
  },
];

export const filterCategories = ["All", "Color", "Warm", "Cool", "Mono", "Film", "Vintage", "Soft", "Dark"];

export const cropRatios = [
  { aspectRatio: "free", label: "Free" },
  { aspectRatio: "1:1", label: "1:1" },
  { aspectRatio: "4:5", label: "4:5" },
  { aspectRatio: "9:16", label: "9:16" },
  { aspectRatio: "16:9", label: "16:9" },
  { aspectRatio: "3:2", label: "3:2" },
  { aspectRatio: "2:3", label: "2:3" },
  { aspectRatio: "4:3", label: "4:3" },
  { aspectRatio: "3:4", label: "3:4" },
  { aspectRatio: "21:9", label: "21:9" },
];
