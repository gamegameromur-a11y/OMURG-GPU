import { AdjustmentKey } from "@/context/EditorContext";

export interface AdjustmentConfig {
  key: AdjustmentKey;
  label: string;
  icon: string;
  iconFamily: "Ionicons" | "Feather" | "MaterialCommunityIcons";
  min: number;
  max: number;
  step: number;
}

export const adjustmentConfigs: AdjustmentConfig[] = [
  { key: "exposure", label: "Exposure", icon: "sunny-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "brightness", label: "Brightness", icon: "bulb-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "contrast", label: "Contrast", icon: "contrast-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "saturation", label: "Saturation", icon: "color-palette-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "warmth", label: "Warmth", icon: "thermometer-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "tint", label: "Tint", icon: "color-wand-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "highlights", label: "Highlights", icon: "flashlight-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "shadows", label: "Shadows", icon: "moon-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "sharpness", label: "Sharpness", icon: "diamond-outline", iconFamily: "Ionicons", min: -100, max: 100, step: 1 },
  { key: "vignette", label: "Vignette", icon: "ellipse-outline", iconFamily: "Ionicons", min: 0, max: 100, step: 1 },
  { key: "grain", label: "Grain", icon: "grid-outline", iconFamily: "Ionicons", min: 0, max: 100, step: 1 },
  { key: "fade", label: "Fade", icon: "water-outline", iconFamily: "Ionicons", min: 0, max: 100, step: 1 },
];
