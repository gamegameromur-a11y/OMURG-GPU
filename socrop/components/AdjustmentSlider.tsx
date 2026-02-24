import React, { useRef, useCallback } from "react";
import { View, Text, StyleSheet, PanResponder, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

interface AdjustmentSliderProps {
  label: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onCommit: () => void;
  onReset?: () => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDER_PADDING = 40;
const SLIDER_WIDTH = SCREEN_WIDTH - SLIDER_PADDING * 2;

export default function AdjustmentSlider({
  label,
  icon,
  value,
  min,
  max,
  onChange,
  onCommit,
  onReset,
}: AdjustmentSliderProps) {
  const range = max - min;
  const normalizedValue = (value - min) / range;
  const centerPosition = min < 0 ? (0 - min) / range : 0;
  const trackRef = useRef<View>(null);
  const trackX = useRef(0);

  const calcValue = useCallback(
    (pageX: number) => {
      const ratio = Math.max(0, Math.min(1, (pageX - trackX.current) / SLIDER_WIDTH));
      return Math.round(min + ratio * range);
    },
    [min, range],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        trackRef.current?.measureInWindow((x) => {
          trackX.current = x;
          onChange(calcValue(evt.nativeEvent.pageX));
        });
      },
      onPanResponderMove: (evt) => {
        onChange(calcValue(evt.nativeEvent.pageX));
      },
      onPanResponderRelease: () => {
        onCommit();
      },
    }),
  ).current;

  const hasValue = value !== 0 && value !== min;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <Ionicons name={icon as any} size={16} color={hasValue ? Colors.dark.accent : Colors.dark.textTertiary} />
          <Text style={[styles.label, hasValue && styles.labelActive]}>{label}</Text>
        </View>
        <View style={styles.labelRight}>
          <Text style={[styles.value, hasValue && styles.valueActive]}>
            {value > 0 && min < 0 ? `+${value}` : `${value}`}
          </Text>
          {hasValue && onReset && (
            <Pressable
              onPress={() => {
                onReset();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onCommit();
              }}
              hitSlop={8}
            >
              <Ionicons name="refresh-outline" size={14} color={Colors.dark.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <View
          ref={trackRef}
          style={styles.sliderTrack}
          {...panResponder.panHandlers}
        >
          <View style={styles.sliderTrackBg} />
          {min < 0 && (
            <View
              style={[styles.sliderCenter, { left: centerPosition * SLIDER_WIDTH - 1 }]}
            />
          )}
          <View
            style={[
              styles.sliderFill,
              min < 0
                ? {
                    left: value >= 0
                      ? centerPosition * SLIDER_WIDTH
                      : normalizedValue * SLIDER_WIDTH,
                    width: Math.abs(normalizedValue - centerPosition) * SLIDER_WIDTH,
                  }
                : {
                    left: 0,
                    width: normalizedValue * SLIDER_WIDTH,
                  },
            ]}
          />
          <View
            style={[styles.sliderThumb, { left: normalizedValue * SLIDER_WIDTH - 9 }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  labelLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.dark.textSecondary,
  },
  labelActive: {
    color: Colors.dark.text,
  },
  value: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.dark.textTertiary,
    minWidth: 32,
    textAlign: "right",
  },
  valueActive: {
    color: Colors.dark.accent,
  },
  sliderContainer: {
    alignItems: "center",
  },
  sliderTrackBg: {
    position: "absolute",
    width: SLIDER_WIDTH,
    height: 3,
    backgroundColor: Colors.dark.sliderTrack,
    borderRadius: 1.5,
    top: 14.5,
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: 32,
    justifyContent: "center",
    position: "relative",
  },
  sliderCenter: {
    position: "absolute",
    width: 2,
    height: 10,
    backgroundColor: Colors.dark.textTertiary,
    borderRadius: 1,
    top: 11,
  },
  sliderFill: {
    position: "absolute",
    height: 3,
    backgroundColor: Colors.dark.accent,
    borderRadius: 1.5,
    top: 14.5,
  },
  sliderThumb: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFF",
    top: 7,
    borderWidth: 2,
    borderColor: Colors.dark.accent,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
