import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const UniAnimatedView = withUnistyles(Animated.View);

const $ = StyleSheet.create((theme) => ({
  page: { flex: 1, backgroundColor: theme.colors.page, paddingTop: 64, paddingHorizontal: 12 },
  heading: { color: theme.colors.text, fontSize: 13, fontWeight: "600" },
  label: { color: theme.colors.text, fontSize: 12 },
  columns: { flexDirection: "row", gap: 8 },
  row: { gap: 2, marginTop: 6 },
  column: { flex: 1, gap: 2 },
  caption: { color: theme.colors.text, fontSize: 10, opacity: 0.6 },
  // Dashed slot so an empty result is visible as empty.
  slot: { height: 48, padding: 4, borderWidth: 1, borderStyle: "dashed", borderColor: "#9e9e9e", borderRadius: 6 },
  box: { width: 40, height: 40, borderRadius: 8, backgroundColor: theme.colors.box },
}));

export default function App() {
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(withTiming(110, { duration: 1200 }), -1, true);
  }, [x]);

  // Carries its own size and colour, so it is visible on its own.
  const sized = useAnimatedStyle(() => ({
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#8e24aa",
    opacity: 0.4 + x.value / 180,
  }));
  // Only movement: invisible unless another style gives the box a size.
  const moving = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const cases = [
    ["a. animated", sized],
    ["b. [static, animated]", [$.box, moving]],
    ["c. [animated, animated]", [sized, moving]],
    ["d. [animated, static]", [moving, $.box]],
  ] as const;

  return (
    <View style={$.page}>
      <Text style={$.heading}>Same style on both components</Text>
      {cases.map(([label, style], i) => (
        <View key={label} style={$.row}>
          <Text style={$.label}>{label}</Text>
          <View style={$.columns}>
            <View style={$.column}>
              <Text style={$.caption}>Animated.View (expected)</Text>
              <View style={$.slot}>
                <Animated.View style={style as never} />
              </View>
            </View>
            <View style={$.column}>
              <Text style={$.caption}>withUnistyles(Animated.View)</Text>
              <View style={$.slot}>
                <UniAnimatedView style={style as never} testID={`box-${"abcd"[i]}`} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
