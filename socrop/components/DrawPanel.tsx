import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useEditor } from "@/context/EditorContext";

const brushColors = [
  "#FFFFFF", "#000000", "#FF4757", "#FF6348", "#FFA502", "#FFEAA7",
  "#2ED573", "#00D4AA", "#1E90FF", "#5352ED", "#A29BFE", "#FD79A8",
];

const brushWidths = [2, 4, 6, 8, 12, 16, 24];

interface DrawPanelProps {
  brushColor: string;
  brushWidth: number;
  isDrawing: boolean;
  onBrushColorChange: (color: string) => void;
  onBrushWidthChange: (width: number) => void;
  onToggleDrawing: () => void;
}

export default function DrawPanel({
  brushColor,
  brushWidth,
  isDrawing,
  onBrushColorChange,
  onBrushWidthChange,
  onToggleDrawing,
}: DrawPanelProps) {
  const { state, clearDrawPaths, commitToHistory } = useEditor();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => {
            onToggleDrawing();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={[styles.drawToggle, isDrawing && styles.drawToggleActive]}
        >
          <Ionicons name="brush" size={20} color={isDrawing ? "#FFF" : Colors.dark.accent} />
          <Text style={[styles.drawToggleText, isDrawing && { color: "#FFF" }]}>
            {isDrawing ? "Drawing..." : "Start Drawing"}
          </Text>
        </Pressable>

        {state.drawPaths.length > 0 && (
          <Pressable
            onPress={() => {
              clearDrawPaths();
              commitToHistory();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={styles.clearBtn}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.dark.danger} />
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Brush Size</Text>
        <View style={styles.widthRow}>
          {brushWidths.map((w) => (
            <Pressable
              key={w}
              onPress={() => {
                onBrushWidthChange(w);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.widthBtn, brushWidth === w && styles.widthBtnActive]}
            >
              <View
                style={{
                  width: Math.min(w * 1.5, 24),
                  height: Math.min(w * 1.5, 24),
                  borderRadius: Math.min(w * 0.75, 12),
                  backgroundColor: brushWidth === w ? Colors.dark.accent : Colors.dark.textTertiary,
                }}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Brush Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
          {brushColors.map((color) => (
            <Pressable
              key={color}
              onPress={() => {
                onBrushColorChange(color);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                brushColor === color && styles.colorSwatchActive,
                color === "#000000" && { borderColor: Colors.dark.border },
              ]}
            />
          ))}
        </ScrollView>
      </View>

      {state.drawPaths.length > 0 && (
        <Text style={styles.pathCount}>{state.drawPaths.length} stroke{state.drawPaths.length > 1 ? "s" : ""}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    gap: 10,
  },
  drawToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.accentDim,
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  drawToggleActive: {
    backgroundColor: Colors.dark.accent,
  },
  drawToggleText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.accent,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  clearText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.danger,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  widthRow: {
    flexDirection: "row",
    gap: 8,
  },
  widthBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  widthBtnActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  colorRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSwatchActive: {
    borderColor: Colors.dark.accent,
  },
  pathCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.textTertiary,
    textAlign: "center",
  },
});
