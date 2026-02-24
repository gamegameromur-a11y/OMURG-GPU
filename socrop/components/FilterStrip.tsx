import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { filterPresets, filterCategories, FilterPreset } from "@/constants/filters";
import { useEditor, AdjustmentKey } from "@/context/EditorContext";
import AdjustmentSlider from "./AdjustmentSlider";

export default function FilterStrip() {
  const {
    state,
    setActiveFilter,
    setAdjustment,
    setFilterIntensity,
    commitToHistory,
  } = useEditor();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPresets =
    activeCategory === "All"
      ? filterPresets
      : filterPresets.filter((f) => f.category === activeCategory || f.id === "original");

  const applyFilter = (filter: FilterPreset) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (filter.id === "original") {
      setActiveFilter(null);
      const keys: AdjustmentKey[] = [
        "brightness", "contrast", "saturation", "warmth", "sharpness",
        "highlights", "shadows", "vignette", "grain", "fade", "tint", "exposure",
      ];
      keys.forEach((key) => setAdjustment(key, 0));
    } else {
      setActiveFilter(filter.id);
      const intensity = state.filterIntensity / 100;
      Object.entries(filter.adjustments).forEach(([key, value]) => {
        setAdjustment(key as AdjustmentKey, Math.round(value * intensity));
      });
    }
    commitToHistory();
  };

  const handleIntensityChange = (val: number) => {
    setFilterIntensity(val);
    if (state.activeFilter) {
      const filter = filterPresets.find((f) => f.id === state.activeFilter);
      if (filter) {
        const intensity = val / 100;
        Object.entries(filter.adjustments).forEach(([key, value]) => {
          setAdjustment(key as AdjustmentKey, Math.round(value * intensity));
        });
      }
    }
  };

  const renderFilter = ({ item }: { item: FilterPreset }) => {
    const isActive =
      item.id === "original"
        ? state.activeFilter === null
        : state.activeFilter === item.id;

    return (
      <Pressable
        onPress={() => applyFilter(item)}
        style={({ pressed }) => [styles.filterItem, pressed && { opacity: 0.7 }]}
      >
        <View style={[styles.filterPreview, isActive && styles.filterPreviewActive]}>
          {state.imageUri ? (
            <Image
              source={{ uri: state.imageUri }}
              style={styles.filterImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.filterPlaceholder} />
          )}
          <View
            style={[
              styles.filterOverlay,
              { backgroundColor: item.overlayColor },
            ]}
          />
          {isActive && (
            <View style={styles.filterCheck}>
              <Ionicons name="checkmark" size={14} color="#FFF" />
            </View>
          )}
        </View>
        <Text
          style={[styles.filterName, isActive && styles.filterNameActive]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {filterCategories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => {
              setActiveCategory(cat);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={[
              styles.categoryChip,
              activeCategory === cat && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredPresets}
        renderItem={renderFilter}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        scrollEnabled={!!filteredPresets.length}
      />

      {state.activeFilter && (
        <View style={styles.intensityRow}>
          <AdjustmentSlider
            label="Intensity"
            icon="speedometer-outline"
            value={state.filterIntensity}
            min={0}
            max={100}
            onChange={handleIntensityChange}
            onCommit={commitToHistory}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
  },
  categoryRow: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.dark.surfaceLight,
  },
  categoryChipActive: {
    backgroundColor: Colors.dark.accentDim,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.textTertiary,
  },
  categoryTextActive: {
    color: Colors.dark.accent,
  },
  list: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  filterItem: {
    alignItems: "center",
    width: 72,
    marginRight: 2,
  },
  filterPreview: {
    width: 66,
    height: 66,
    borderRadius: 14,
    backgroundColor: Colors.dark.surfaceLight,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  filterPreviewActive: {
    borderColor: Colors.dark.accent,
  },
  filterImage: {
    width: "100%",
    height: "100%",
  },
  filterPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  filterCheck: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  filterName: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.textTertiary,
    marginTop: 5,
    textAlign: "center",
  },
  filterNameActive: {
    color: Colors.dark.accent,
    fontFamily: "Inter_600SemiBold",
  },
  intensityRow: {
    paddingTop: 2,
  },
});
