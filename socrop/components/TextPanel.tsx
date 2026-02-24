import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Crypto from "expo-crypto";
import Colors from "@/constants/colors";
import { useEditor, TextOverlay } from "@/context/EditorContext";

const textColors = [
  "#FFFFFF", "#000000", "#FF4757", "#FF6B81", "#FF3838", "#FFA502",
  "#FFEAA7", "#FDCB6E", "#2ED573", "#00D4AA", "#00CEC9", "#1E90FF",
  "#0984E3", "#5352ED", "#6C5CE7", "#A29BFE", "#FD79A8", "#E84393",
  "#B2BEC3", "#636E72", "#DFE6E9", "#74B9FF",
];

const bgColors = [
  "transparent", "#000000CC", "#FFFFFFCC", "#FF4757CC", "#FFA502CC",
  "#00D4AACC", "#1E90FFCC", "#5352EDCC", "#FD79A8CC", "#2ED573CC",
];

const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72];

export default function TextPanel() {
  const { state, addTextOverlay, removeTextOverlay, updateTextOverlay, commitToHistory } =
    useEditor();
  const [inputText, setInputText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [selectedBg, setSelectedBg] = useState("transparent");
  const [selectedSize, setSelectedSize] = useState(28);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [hasShadow, setHasShadow] = useState(true);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddText = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (editingId) {
      updateTextOverlay(editingId, {
        text: inputText.trim(),
        fontSize: selectedSize,
        color: selectedColor,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        textAlign,
        shadowEnabled: hasShadow,
        opacity: 1,
        letterSpacing,
        backgroundColor: selectedBg,
      });
      setEditingId(null);
    } else {
      const newOverlay: TextOverlay = {
        id: Crypto.randomUUID(),
        text: inputText.trim(),
        x: 0.5,
        y: 0.3 + Math.random() * 0.4,
        fontSize: selectedSize,
        color: selectedColor,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        textAlign,
        shadowEnabled: hasShadow,
        shadowColor: "rgba(0,0,0,0.6)",
        opacity: 1,
        letterSpacing,
        backgroundColor: selectedBg,
      };
      addTextOverlay(newOverlay);
    }
    setInputText("");
    commitToHistory();
  };

  const handleEditOverlay = (overlay: TextOverlay) => {
    setEditingId(overlay.id);
    setInputText(overlay.text);
    setSelectedColor(overlay.color);
    setSelectedSize(overlay.fontSize);
    setIsBold(overlay.fontWeight === "bold");
    setIsItalic(overlay.fontStyle === "italic");
    setTextAlign(overlay.textAlign);
    setHasShadow(overlay.shadowEnabled);
    setLetterSpacing(overlay.letterSpacing);
    setSelectedBg(overlay.backgroundColor);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your text..."
          placeholderTextColor={Colors.dark.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          returnKeyType="done"
          onSubmitEditing={handleAddText}
          multiline
        />
        <Pressable
          onPress={handleAddText}
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.7 },
            !inputText.trim() && styles.addButtonDisabled,
          ]}
          disabled={!inputText.trim()}
        >
          <Ionicons name={editingId ? "checkmark" : "add"} size={22} color="#FFF" />
        </Pressable>
      </View>

      <View style={styles.styleRow}>
        <Pressable
          onPress={() => { setIsBold(!isBold); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={[styles.styleBtn, isBold && styles.styleBtnActive]}
        >
          <Text style={[styles.styleBtnText, isBold && styles.styleBtnTextActive, { fontFamily: "Inter_700Bold" }]}>B</Text>
        </Pressable>
        <Pressable
          onPress={() => { setIsItalic(!isItalic); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={[styles.styleBtn, isItalic && styles.styleBtnActive]}
        >
          <Text style={[styles.styleBtnText, isItalic && styles.styleBtnTextActive, { fontStyle: "italic" }]}>I</Text>
        </Pressable>
        <Pressable
          onPress={() => { setHasShadow(!hasShadow); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={[styles.styleBtn, hasShadow && styles.styleBtnActive]}
        >
          <Ionicons name="layers-outline" size={16} color={hasShadow ? Colors.dark.accent : Colors.dark.textTertiary} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          onPress={() => { setTextAlign("left"); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={[styles.styleBtn, textAlign === "left" && styles.styleBtnActive]}
        >
          <Ionicons name="reorder-three-outline" size={18} color={textAlign === "left" ? Colors.dark.accent : Colors.dark.textTertiary} />
        </Pressable>
        <Pressable
          onPress={() => { setTextAlign("center"); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={[styles.styleBtn, textAlign === "center" && styles.styleBtnActive]}
        >
          <Ionicons name="menu-outline" size={18} color={textAlign === "center" ? Colors.dark.accent : Colors.dark.textTertiary} />
        </Pressable>
        <Pressable
          onPress={() => { setTextAlign("right"); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={[styles.styleBtn, textAlign === "right" && styles.styleBtnActive]}
        >
          <Ionicons name="reorder-three-outline" size={18} color={textAlign === "right" ? Colors.dark.accent : Colors.dark.textTertiary} style={{ transform: [{ scaleX: -1 }] }} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Size</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sizeRow}>
          {fontSizes.map((size) => (
            <Pressable
              key={size}
              onPress={() => { setSelectedSize(size); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.sizeButton, selectedSize === size && styles.sizeButtonActive]}
            >
              <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Letter Spacing</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sizeRow}>
          {[-2, -1, 0, 1, 2, 3, 4, 6, 8, 10].map((sp) => (
            <Pressable
              key={sp}
              onPress={() => { setLetterSpacing(sp); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.sizeButton, letterSpacing === sp && styles.sizeButtonActive]}
            >
              <Text style={[styles.sizeText, letterSpacing === sp && styles.sizeTextActive]}>{sp}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Text Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
          {textColors.map((color) => (
            <Pressable
              key={color}
              onPress={() => { setSelectedColor(color); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                selectedColor === color && styles.colorSwatchActive,
                color === "#000000" && styles.darkSwatch,
              ]}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Background</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
          {bgColors.map((color, i) => (
            <Pressable
              key={`bg-${i}`}
              onPress={() => { setSelectedBg(color); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[
                styles.colorSwatch,
                { backgroundColor: color === "transparent" ? Colors.dark.surfaceLight : color },
                selectedBg === color && styles.colorSwatchActive,
              ]}
            >
              {color === "transparent" && (
                <Ionicons name="close" size={14} color={Colors.dark.textTertiary} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {state.textOverlays.length > 0 && (
        <View style={styles.overlayList}>
          <Text style={styles.sectionLabel}>Text Layers ({state.textOverlays.length})</Text>
          {state.textOverlays.map((overlay) => (
            <View key={overlay.id} style={styles.overlayItem}>
              <View style={[styles.overlayColor, { backgroundColor: overlay.color }]} />
              <Pressable
                style={{ flex: 1 }}
                onPress={() => handleEditOverlay(overlay)}
              >
                <Text style={styles.overlayText} numberOfLines={1}>{overlay.text}</Text>
                <Text style={styles.overlayMeta}>{overlay.fontSize}pt  {overlay.fontWeight}</Text>
              </Pressable>
              <Pressable
                onPress={() => { removeTextOverlay(overlay.id); commitToHistory(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.dark.danger} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    gap: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    maxHeight: 60,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    opacity: 0.3,
  },
  styleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  styleBtn: {
    width: 36,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  styleBtnActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  styleBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
  },
  styleBtnTextActive: {
    color: Colors.dark.accent,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 4,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sizeRow: {
    flexDirection: "row",
    gap: 5,
  },
  sizeButton: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sizeButtonActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  sizeText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.textTertiary,
  },
  sizeTextActive: {
    color: Colors.dark.accent,
  },
  colorRow: {
    flexDirection: "row",
    gap: 7,
    paddingVertical: 2,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchActive: {
    borderColor: Colors.dark.accent,
  },
  darkSwatch: {
    borderColor: Colors.dark.border,
  },
  overlayList: {
    gap: 6,
    paddingTop: 2,
  },
  overlayItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  overlayColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  overlayText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.text,
  },
  overlayMeta: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.textTertiary,
    marginTop: 1,
  },
});
