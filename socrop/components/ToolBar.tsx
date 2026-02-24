import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

export type EditorTool = "adjust" | "filters" | "crop" | "text" | "transform" | "draw";

interface ToolBarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
}

const tools: { id: EditorTool; icon: string; label: string }[] = [
  { id: "filters", icon: "color-filter-outline", label: "Filters" },
  { id: "adjust", icon: "options-outline", label: "Adjust" },
  { id: "crop", icon: "crop-outline", label: "Crop" },
  { id: "transform", icon: "sync-outline", label: "Transform" },
  { id: "text", icon: "text-outline", label: "Text" },
  { id: "draw", icon: "brush-outline", label: "Draw" },
];

export default function ToolBar({ activeTool, onToolChange }: ToolBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <Pressable
              key={tool.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onToolChange(tool.id);
              }}
              style={({ pressed }) => [
                styles.toolButton,
                isActive && styles.toolButtonActive,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons
                name={tool.icon as any}
                size={20}
                color={isActive ? Colors.dark.accent : Colors.dark.textTertiary}
              />
              <Text style={[styles.toolLabel, isActive && styles.toolLabelActive]}>
                {tool.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
  },
  scrollContent: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 2,
  },
  toolButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 3,
  },
  toolButtonActive: {
    backgroundColor: Colors.dark.accentDim,
  },
  toolLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
  },
  toolLabelActive: {
    color: Colors.dark.accent,
  },
});
