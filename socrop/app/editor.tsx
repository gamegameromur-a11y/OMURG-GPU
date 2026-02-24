import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  PanResponder,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useEditor, DrawPath } from "@/context/EditorContext";
import ToolBar, { EditorTool } from "@/components/ToolBar";
import FilterStrip from "@/components/FilterStrip";
import AdjustmentSlider from "@/components/AdjustmentSlider";
import CropPanel from "@/components/CropPanel";
import TransformPanel from "@/components/TransformPanel";
import TextPanel from "@/components/TextPanel";
import DrawPanel from "@/components/DrawPanel";
import { adjustmentConfigs } from "@/constants/adjustments";
import Svg, { Polyline } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function EditorScreen() {
  const insets = useSafeAreaInsets();
  const {
    state,
    canUndo,
    canRedo,
    undo,
    redo,
    setAdjustment,
    resetAdjustment,
    resetAllAdjustments,
    commitToHistory,
    resetEditor,
    addDrawPath,
  } = useEditor();

  const [activeTool, setActiveTool] = useState<EditorTool>("filters");
  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false);
  const [brushColor, setBrushColor] = useState("#FFFFFF");
  const brushColorRef = useRef("#FFFFFF");
  const [brushWidth, setBrushWidth] = useState(4);
  const brushWidthRef = useRef(4);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<View>(null);
  const canvasLayout = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const imageTransform = useMemo(() => {
    const transforms: any[] = [];
    if (state.rotation) transforms.push({ rotate: `${state.rotation}deg` });
    if (state.flipH) transforms.push({ scaleX: -1 });
    if (state.flipV) transforms.push({ scaleY: -1 });
    return transforms;
  }, [state.rotation, state.flipH, state.flipV]);

  const canvasSize = useMemo(() => {
    let w = SCREEN_WIDTH - 24;
    let h = w;
    if (state.cropRatio && state.cropRatio.aspectRatio !== "free") {
      const parts = state.cropRatio.aspectRatio.split(":");
      if (parts.length === 2) {
        const ratioW = parseInt(parts[0]);
        const ratioH = parseInt(parts[1]);
        h = w * (ratioH / ratioW);
        const maxH = SCREEN_WIDTH * 0.55;
        if (h > maxH) {
          h = maxH;
          w = h * (ratioW / ratioH);
        }
      }
    }
    return { width: w, height: h };
  }, [state.cropRatio]);

  const adj = state.adjustments;

  const brightnessOverlay = useMemo(() => {
    if (adj.brightness > 0) {
      return `rgba(255, 255, 255, ${adj.brightness / 200})`;
    } else if (adj.brightness < 0) {
      return `rgba(0, 0, 0, ${Math.abs(adj.brightness) / 200})`;
    }
    return "transparent";
  }, [adj.brightness]);

  const exposureOverlay = useMemo(() => {
    if (adj.exposure > 0) {
      return `rgba(255, 255, 255, ${adj.exposure / 250})`;
    } else if (adj.exposure < 0) {
      return `rgba(0, 0, 0, ${Math.abs(adj.exposure) / 250})`;
    }
    return "transparent";
  }, [adj.exposure]);

  const warmthOverlay = useMemo(() => {
    if (adj.warmth > 0) {
      return `rgba(255, 140, 0, ${adj.warmth / 300})`;
    } else if (adj.warmth < 0) {
      return `rgba(30, 100, 255, ${Math.abs(adj.warmth) / 300})`;
    }
    return "transparent";
  }, [adj.warmth]);

  const tintOverlay = useMemo(() => {
    if (adj.tint > 0) {
      return `rgba(200, 50, 200, ${adj.tint / 400})`;
    } else if (adj.tint < 0) {
      return `rgba(50, 200, 50, ${Math.abs(adj.tint) / 400})`;
    }
    return "transparent";
  }, [adj.tint]);

  const contrastStyle = useMemo(() => {
    if (adj.contrast > 0) {
      return { opacity: 1 + adj.contrast / 200 };
    } else if (adj.contrast < 0) {
      return { opacity: 1 + adj.contrast / 300 };
    }
    return {};
  }, [adj.contrast]);

  const saturationOverlay = useMemo(() => {
    if (adj.saturation < 0) {
      return `rgba(128, 128, 128, ${Math.abs(adj.saturation) / 150})`;
    }
    return "transparent";
  }, [adj.saturation]);

  const highlightsOverlay = useMemo(() => {
    if (adj.highlights > 0) {
      return `rgba(255, 255, 255, ${adj.highlights / 350})`;
    }
    return "transparent";
  }, [adj.highlights]);

  const shadowsOverlay = useMemo(() => {
    if (adj.shadows < 0) {
      return `rgba(0, 0, 0, ${Math.abs(adj.shadows) / 250})`;
    }
    return "transparent";
  }, [adj.shadows]);

  const fadeOverlay = useMemo(() => {
    if (adj.fade > 0) {
      return `rgba(200, 200, 210, ${adj.fade / 250})`;
    }
    return "transparent";
  }, [adj.fade]);

  const drawPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDrawingRef.current,
      onMoveShouldSetPanResponder: () => isDrawingRef.current,
      onPanResponderGrant: (evt) => {
        canvasRef.current?.measureInWindow((cx, cy, cw, ch) => {
          canvasLayout.current = { x: cx, y: cy, w: cw, h: ch };
          const nx = (evt.nativeEvent.pageX - cx) / cw;
          const ny = (evt.nativeEvent.pageY - cy) / ch;
          const p = [{ x: nx, y: ny }];
          currentPathRef.current = p;
          setCurrentPath(p);
        });
      },
      onPanResponderMove: (evt) => {
        const { x, y, w, h } = canvasLayout.current;
        const nx = (evt.nativeEvent.pageX - x) / w;
        const ny = (evt.nativeEvent.pageY - y) / h;
        currentPathRef.current = [...currentPathRef.current, { x: nx, y: ny }];
        setCurrentPath([...currentPathRef.current]);
      },
      onPanResponderRelease: () => {
        if (currentPathRef.current.length > 1) {
          const newPath: DrawPath = {
            id: Crypto.randomUUID(),
            points: currentPathRef.current,
            color: brushColorRef.current,
            width: brushWidthRef.current,
          };
          addDrawPath(newPath);
          commitToHistory();
        }
        currentPathRef.current = [];
        setCurrentPath([]);
      },
    }),
  ).current;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetEditor();
    router.back();
  };

  const handleExport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/export");
  };

  if (!state.imageUri) {
    router.back();
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.header}>
        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="close" size={22} color={Colors.dark.text} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Pressable
            onPress={() => { undo(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            disabled={!canUndo}
            style={({ pressed }) => [styles.undoBtn, !canUndo && styles.undoBtnDisabled, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="arrow-undo" size={18} color={canUndo ? Colors.dark.text : Colors.dark.textTertiary} />
          </Pressable>
          <Pressable
            onPress={() => { redo(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            disabled={!canRedo}
            style={({ pressed }) => [styles.undoBtn, !canRedo && styles.undoBtnDisabled, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="arrow-redo" size={18} color={canRedo ? Colors.dark.text : Colors.dark.textTertiary} />
          </Pressable>
          <Pressable
            onPress={() => { resetAllAdjustments(); commitToHistory(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            style={({ pressed }) => [styles.undoBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="refresh" size={18} color={Colors.dark.textSecondary} />
          </Pressable>
        </View>

        <Pressable
          onPress={handleExport}
          style={({ pressed }) => [styles.exportBtn, pressed && { opacity: 0.8 }]}
        >
          <Feather name="download" size={16} color="#FFF" />
          <Text style={styles.exportText}>Export</Text>
        </Pressable>
      </View>

      <View style={styles.canvasArea}>
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.canvasWrapper, { width: canvasSize.width, height: canvasSize.height }]}
        >
          <View
            ref={canvasRef}
            style={[styles.imageContainer, { transform: imageTransform }, contrastStyle]}
            {...drawPanResponder.panHandlers}
          >
            <Image
              source={{ uri: state.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />

            {brightnessOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: brightnessOverlay }]} />
            )}
            {exposureOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: exposureOverlay }]} />
            )}
            {warmthOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: warmthOverlay }]} />
            )}
            {tintOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: tintOverlay }]} />
            )}
            {saturationOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: saturationOverlay }]} />
            )}
            {highlightsOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: highlightsOverlay }]} />
            )}
            {shadowsOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: shadowsOverlay }]} />
            )}
            {fadeOverlay !== "transparent" && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: fadeOverlay }]} />
            )}

            {adj.vignette > 0 && (
              <View style={[StyleSheet.absoluteFill, styles.vignetteContainer]}>
                <View style={[styles.vignetteEdge, {
                  borderWidth: 40 + adj.vignette * 0.4,
                  borderColor: `rgba(0,0,0,${adj.vignette / 130})`,
                }]} />
              </View>
            )}

            {adj.grain > 0 && (
              <View style={[StyleSheet.absoluteFill, {
                backgroundColor: `rgba(128,128,128,${adj.grain / 500})`,
              }]} />
            )}

            {(state.drawPaths.length > 0 || currentPath.length > 0) && (
              <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}>
                {state.drawPaths.map((path) => (
                  <Polyline
                    key={path.id}
                    points={path.points.map((p) => `${p.x * canvasSize.width},${p.y * canvasSize.height}`).join(" ")}
                    stroke={path.color}
                    strokeWidth={path.width}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {currentPath.length > 1 && (
                  <Polyline
                    points={currentPath.map((p) => `${p.x * canvasSize.width},${p.y * canvasSize.height}`).join(" ")}
                    stroke={brushColor}
                    strokeWidth={brushWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </Svg>
            )}
          </View>

          {state.textOverlays.map((overlay) => (
            <View
              key={overlay.id}
              style={[
                styles.textOverlayWrap,
                {
                  left: `${overlay.x * 100}%`,
                  top: `${overlay.y * 100}%`,
                  transform: [{ translateX: -50 }, { translateY: -50 }],
                  opacity: overlay.opacity,
                },
              ]}
            >
              <Text
                style={[
                  styles.textOverlay,
                  {
                    fontSize: overlay.fontSize * 0.6,
                    color: overlay.color,
                    fontWeight: overlay.fontWeight,
                    fontStyle: overlay.fontStyle,
                    textAlign: overlay.textAlign,
                    letterSpacing: overlay.letterSpacing,
                    backgroundColor: overlay.backgroundColor,
                    paddingHorizontal: overlay.backgroundColor !== "transparent" ? 6 : 0,
                    paddingVertical: overlay.backgroundColor !== "transparent" ? 3 : 0,
                    borderRadius: overlay.backgroundColor !== "transparent" ? 4 : 0,
                    overflow: "hidden",
                  },
                  overlay.shadowEnabled && {
                    textShadowColor: "rgba(0,0,0,0.7)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  },
                ]}
              >
                {overlay.text}
              </Text>
            </View>
          ))}

          {isDrawing && (
            <View style={styles.drawIndicator}>
              <Ionicons name="brush" size={12} color="#FFF" />
            </View>
          )}
        </Animated.View>
      </View>

      <View style={[styles.bottomPanel, { paddingBottom: bottomPadding }]}>
        <ToolBar activeTool={activeTool} onToolChange={setActiveTool} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.toolContent}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          {activeTool === "adjust" && (
            <View>
              {adjustmentConfigs.map((config) => (
                <AdjustmentSlider
                  key={config.key}
                  label={config.label}
                  icon={config.icon}
                  value={state.adjustments[config.key]}
                  min={config.min}
                  max={config.max}
                  onChange={(val) => setAdjustment(config.key, val)}
                  onCommit={commitToHistory}
                  onReset={() => resetAdjustment(config.key)}
                />
              ))}
              <View style={{ height: 8 }} />
            </View>
          )}
          {activeTool === "filters" && <FilterStrip />}
          {activeTool === "crop" && <CropPanel />}
          {activeTool === "transform" && <TransformPanel />}
          {activeTool === "text" && <TextPanel />}
          {activeTool === "draw" && (
            <DrawPanel
              brushColor={brushColor}
              brushWidth={brushWidth}
              isDrawing={isDrawing}
              onBrushColorChange={(c) => { setBrushColor(c); brushColorRef.current = c; }}
              onBrushWidthChange={(w) => { setBrushWidth(w); brushWidthRef.current = w; }}
              onToggleDrawing={() => {
                const next = !isDrawing;
                setIsDrawing(next);
                isDrawingRef.current = next;
              }}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    gap: 4,
  },
  undoBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.dark.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  undoBtnDisabled: {
    opacity: 0.35,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  exportText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#FFF",
  },
  canvasArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  canvasWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.dark.surface,
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  vignetteContainer: {
    overflow: "hidden",
  },
  vignetteEdge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  textOverlayWrap: {
    position: "absolute",
    maxWidth: "80%",
  },
  textOverlay: {
    fontFamily: "Inter_700Bold",
  },
  drawIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPanel: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  toolContent: {
    maxHeight: 280,
  },
});
