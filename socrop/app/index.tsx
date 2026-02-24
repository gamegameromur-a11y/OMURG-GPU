import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEditor } from "@/context/EditorContext";
import Colors from "@/constants/colors";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { setImageUri } = useEditor();

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      router.push("/editor");
    }
  };

  const takePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      router.push("/editor");
    }
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: topPadding, paddingBottom: bottomPadding }]}>
      <LinearGradient
        colors={["#0D0D0D", "#111118", "#0D0D0D"]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="aperture" size={30} color={Colors.dark.accent} />
          </View>
          <View>
            <Text style={styles.logoText}>Socrop</Text>
            <Text style={styles.tagline}>Professional Photo Editor</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.centerContent}>
        <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.actionArea}>
          <Pressable
            onPress={pickImage}
            style={({ pressed }) => [styles.mainButton, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            testID="pick-image"
          >
            <LinearGradient
              colors={[Colors.dark.accent, "#00B894"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainButtonGradient}
            >
              <View style={styles.mainButtonIconWrap}>
                <Ionicons name="images-outline" size={36} color="#FFF" />
              </View>
              <View style={styles.mainButtonTextWrap}>
                <Text style={styles.mainButtonText}>Open Gallery</Text>
                <Text style={styles.mainButtonSub}>Choose a photo to edit</Text>
              </View>
              <Feather name="chevron-right" size={22} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={takePhoto}
            style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
            testID="take-photo"
          >
            <View style={styles.secondaryButtonInner}>
              <View style={styles.cameraIconWrap}>
                <Feather name="camera" size={22} color={Colors.dark.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.secondaryButtonText}>Take Photo</Text>
                <Text style={styles.secondaryButtonSub}>Use camera to capture</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.dark.textTertiary} />
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.featuresTitle}>Editing Tools</Text>
          <View style={styles.featureGrid}>
            <FeatureCard icon="options-outline" label="Adjust" desc="12 controls" iconFamily="Ionicons" />
            <FeatureCard icon="color-filter-outline" label="Filters" desc="30 presets" iconFamily="Ionicons" />
            <FeatureCard icon="crop-outline" label="Crop" desc="10 ratios" iconFamily="Ionicons" />
            <FeatureCard icon="text-outline" label="Text" desc="Full styling" iconFamily="Ionicons" />
            <FeatureCard icon="brush-outline" label="Draw" desc="Free brush" iconFamily="Ionicons" />
            <FeatureCard icon="download-outline" label="Export" desc="JPG/PNG/WEBP" iconFamily="Ionicons" />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

function FeatureCard({
  icon,
  label,
  desc,
  iconFamily,
}: {
  icon: string;
  label: string;
  desc: string;
  iconFamily: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconWrap}>
        <Ionicons name={icon as any} size={20} color={Colors.dark.accent} />
      </View>
      <Text style={styles.featureLabel}>{label}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.dark.accentDim,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.textTertiary,
    marginTop: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  actionArea: {
    gap: 12,
    marginBottom: 32,
  },
  mainButton: {
    borderRadius: 18,
    overflow: "hidden",
  },
  mainButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    gap: 16,
  },
  mainButtonIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonTextWrap: {
    flex: 1,
    gap: 3,
  },
  mainButtonText: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
  },
  mainButtonSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
    overflow: "hidden",
  },
  secondaryButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  cameraIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.accentDim,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.text,
  },
  secondaryButtonSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.textTertiary,
    marginTop: 2,
  },
  featuresTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  featureCard: {
    width: (width - 60) / 3,
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.dark.accentDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  featureLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.text,
  },
  featureDesc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.dark.textTertiary,
  },
});
