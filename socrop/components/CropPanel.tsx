import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { cropRatios } from "@/constants/filters";
import { useEditor } from "@/context/EditorContext";

const socialPresets = [
  { aspectRatio: "1:1", label: "Instagram Post", icon: "logo-instagram" },
  { aspectRatio: "4:5", label: "Instagram Portrait", icon: "logo-instagram" },
  { aspectRatio: "9:16", label: "Story / Reels", icon: "phone-portrait-outline" },
  { aspectRatio: "16:9", label: "YouTube / Cover", icon: "logo-youtube" },
  { aspectRatio: "2:3", label: "Pinterest", icon: "logo-pinterest" },
  { aspectRatio: "4:3", label: "Facebook", icon: "logo-facebook" },
];

export default function CropPanel() {
  const { state, setCropRatio, commitToHistory } = useEditor();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Aspect Ratio</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ratioList}
      >
        {cropRatios.map((ratio) => {
          const isActive = state.cropRatio?.aspectRatio === ratio.aspectRatio;
          return (
            <Pressable
              key={ratio.aspectRatio}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCropRatio(isActive ? null : ratio);
                commitToHistory();
              }}
              style={({ pressed }) => [
                styles.ratioButton,
                isActive && styles.ratioButtonActive,
                pressed && { opacity: 0.7 },
              ]}
            >
              <RatioIcon ratio={ratio.aspectRatio} active={isActive} />
              <Text style={[styles.ratioLabel, isActive && styles.ratioLabelActive]}>
                {ratio.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionLabel}>Social Media Presets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.socialList}
      >
        {socialPresets.map((preset) => {
          const isActive = state.cropRatio?.aspectRatio === preset.aspectRatio;
          return (
            <Pressable
              key={preset.label}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCropRatio(isActive ? null : { aspectRatio: preset.aspectRatio, label: preset.label });
                commitToHistory();
              }}
              style={({ pressed }) => [
                styles.socialCard,
                isActive && styles.socialCardActive,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons
                name={preset.icon as any}
                size={20}
                color={isActive ? Colors.dark.accent : Colors.dark.textSecondary}
              />
              <Text style={[styles.socialLabel, isActive && styles.socialLabelActive]} numberOfLines={1}>
                {preset.label}
              </Text>
              <Text style={[styles.socialRatio, isActive && styles.socialRatioActive]}>
                {preset.aspectRatio}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {state.cropRatio && (
        <Pressable
          onPress={() => {
            setCropRatio(null);
            commitToHistory();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={styles.resetBtn}
        >
          <Ionicons name="close-circle-outline" size={16} color={Colors.dark.danger} />
          <Text style={styles.resetText}>Remove Crop</Text>
        </Pressable>
      )}
    </View>
  );
}

function RatioIcon({ ratio, active }: { ratio: string; active: boolean }) {
  const color = active ? Colors.dark.accent : Colors.dark.textTertiary;

  if (ratio === "free") {
    return <Ionicons name="resize-outline" size={22} color={color} />;
  }

  const dims: Record<string, { w: number; h: number }> = {
    "1:1": { w: 20, h: 20 },
    "4:5": { w: 18, h: 22 },
    "9:16": { w: 14, h: 25 },
    "16:9": { w: 25, h: 14 },
    "3:2": { w: 24, h: 16 },
    "2:3": { w: 16, h: 24 },
    "4:3": { w: 23, h: 17 },
    "3:4": { w: 17, h: 23 },
    "21:9": { w: 28, h: 12 },
  };

  const d = dims[ratio] || { w: 20, h: 20 };

  return (
    <View style={{ width: d.w, height: d.h, borderWidth: 2, borderColor: color, borderRadius: 3 }} />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  ratioList: {
    gap: 8,
    paddingVertical: 4,
  },
  ratioButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 70,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  ratioButtonActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  ratioLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
  },
  ratioLabelActive: {
    color: Colors.dark.accent,
  },
  socialList: {
    gap: 8,
    paddingVertical: 4,
  },
  socialCard: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  socialCardActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  socialLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.textSecondary,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  socialLabelActive: {
    color: Colors.dark.text,
  },
  socialRatio: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
  },
  socialRatioActive: {
    color: Colors.dark.accent,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  resetText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.danger,
  },
});
