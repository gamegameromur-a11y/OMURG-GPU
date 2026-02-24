import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useEditor } from "@/context/EditorContext";

type ExportFormat = "jpeg" | "png" | "webp";

const formatOptions: { id: ExportFormat; label: string; desc: string }[] = [
  { id: "jpeg", label: "JPG", desc: "Smaller file size" },
  { id: "png", label: "PNG", desc: "Best quality" },
  { id: "webp", label: "WEBP", desc: "Modern format" },
];

const qualityOptions = [
  { label: "Max", value: 1.0 },
  { label: "High", value: 0.85 },
  { label: "Medium", value: 0.6 },
  { label: "Low", value: 0.3 },
];

const resizeOptions = [
  { label: "Original", value: 0 },
  { label: "2000px", value: 2000 },
  { label: "1500px", value: 1500 },
  { label: "1080px", value: 1080 },
  { label: "720px", value: 720 },
  { label: "480px", value: 480 },
];

export default function ExportScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useEditor();
  const [format, setFormat] = useState<ExportFormat>("jpeg");
  const [quality, setQuality] = useState(1.0);
  const [maxSize, setMaxSize] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = async () => {
    if (!state.imageUri || saving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSaving(true);

    try {
      const actions: ImageManipulator.Action[] = [];

      if (state.rotation !== 0) {
        actions.push({ rotate: state.rotation });
      }
      if (state.flipH) {
        actions.push({ flip: ImageManipulator.FlipType.Horizontal });
      }
      if (state.flipV) {
        actions.push({ flip: ImageManipulator.FlipType.Vertical });
      }
      if (maxSize > 0) {
        actions.push({ resize: { width: maxSize } });
      }

      let compressFormat: ImageManipulator.SaveFormat;
      if (format === "png") {
        compressFormat = ImageManipulator.SaveFormat.PNG;
      } else if (format === "webp") {
        compressFormat = ImageManipulator.SaveFormat.WEBP;
      } else {
        compressFormat = ImageManipulator.SaveFormat.JPEG;
      }

      const result = await ImageManipulator.manipulateAsync(
        state.imageUri,
        actions.length > 0 ? actions : [],
        { compress: quality, format: compressFormat },
      );

      if (Platform.OS !== "web") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(result.uri);
          setSaved(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => router.back(), 1500);
        } else {
          Alert.alert("Permission Required", "Please allow access to save photos.");
        }
      } else {
        setSaved(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => router.back(), 1500);
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", "Failed to save image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding, paddingBottom: bottomPadding + 16 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Export Image</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.previewContainer}>
          {state.imageUri && (
            <Image source={{ uri: state.imageUri }} style={styles.previewImage} resizeMode="contain" />
          )}
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionLabel}>Format</Text>
          <View style={styles.optionRow}>
            {formatOptions.map((opt) => (
              <Pressable
                key={opt.id}
                onPress={() => { setFormat(opt.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.optionCard, format === opt.id && styles.optionCardActive]}
              >
                <Text style={[styles.optionText, format === opt.id && styles.optionTextActive]}>{opt.label}</Text>
                <Text style={[styles.optionDesc, format === opt.id && styles.optionDescActive]}>{opt.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionLabel}>Quality</Text>
          <View style={styles.optionRow}>
            {qualityOptions.map((opt) => (
              <Pressable
                key={opt.label}
                onPress={() => { setQuality(opt.value); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.qualityBtn, quality === opt.value && styles.qualityBtnActive]}
              >
                <Text style={[styles.qualityText, quality === opt.value && styles.qualityTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionLabel}>Max Resolution</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.resizeRow}>
            {resizeOptions.map((opt) => (
              <Pressable
                key={opt.label}
                onPress={() => { setMaxSize(opt.value); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[styles.qualityBtn, maxSize === opt.value && styles.qualityBtnActive]}
              >
                <Text style={[styles.qualityText, maxSize === opt.value && styles.qualityTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {saved ? (
        <View style={styles.savedContainer}>
          <Ionicons name="checkmark-circle" size={44} color={Colors.dark.accent} />
          <Text style={styles.savedText}>Saved Successfully</Text>
        </View>
      ) : (
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.8 }, saving && { opacity: 0.6 }]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Feather name="download" size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>Save to Gallery</Text>
            </>
          )}
        </Pressable>
      )}
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
    paddingVertical: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.text,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  previewContainer: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  previewImage: {
    width: 180,
    height: 180,
    borderRadius: 14,
    backgroundColor: Colors.dark.surface,
  },
  optionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  optionRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.dark.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 3,
  },
  optionCardActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  optionText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.dark.textTertiary,
  },
  optionTextActive: {
    color: Colors.dark.accent,
  },
  optionDesc: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.textTertiary,
  },
  optionDescActive: {
    color: Colors.dark.textSecondary,
  },
  qualityBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  qualityBtnActive: {
    backgroundColor: Colors.dark.accentDim,
    borderColor: Colors.dark.accent,
  },
  qualityText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
  },
  qualityTextActive: {
    color: Colors.dark.accent,
  },
  resizeRow: {
    gap: 8,
  },
  savedContainer: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  savedText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.accent,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.dark.accent,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
  },
});
