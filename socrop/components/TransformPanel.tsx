import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useEditor } from "@/context/EditorContext";

export default function TransformPanel() {
  const { state, rotate, rotateBy, flipHorizontal, flipVertical, commitToHistory } =
    useEditor();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Rotate</Text>
      <View style={styles.row}>
        <ActionButton
          icon="rotate-left"
          label="-90"
          onPress={() => { rotateBy(-90); commitToHistory(); }}
        />
        <ActionButton
          icon="rotate-right"
          label="+90"
          onPress={() => { rotate(); commitToHistory(); }}
        />
        <ActionButton
          icon="rotate-left"
          label="-45"
          onPress={() => { rotateBy(-45); commitToHistory(); }}
        />
        <ActionButton
          icon="rotate-right"
          label="+45"
          onPress={() => { rotateBy(45); commitToHistory(); }}
        />
      </View>

      <Text style={styles.sectionLabel}>Flip</Text>
      <View style={styles.row}>
        <ActionButton
          icon="flip-horizontal"
          label="Horizontal"
          active={state.flipH}
          onPress={() => { flipHorizontal(); commitToHistory(); }}
        />
        <ActionButton
          icon="flip-vertical"
          label="Vertical"
          active={state.flipV}
          onPress={() => { flipVertical(); commitToHistory(); }}
        />
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.dark.textTertiary} />
        <Text style={styles.infoText}>
          Current rotation: {state.rotation}
        </Text>
      </View>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => [
        styles.actionButton,
        active && styles.actionButtonActive,
        pressed && { opacity: 0.7 },
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={active ? Colors.dark.accent : Colors.dark.textSecondary}
      />
      <Text style={[styles.actionLabel, active && styles.actionLabelActive]}>
        {label}
      </Text>
    </Pressable>
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
  row: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.dark.surfaceLight,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  actionButtonActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  actionLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.textTertiary,
  },
  actionLabelActive: {
    color: Colors.dark.accent,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.textTertiary,
  },
});
