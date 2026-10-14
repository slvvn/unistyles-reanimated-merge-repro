import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const UniAnimatedView = withUnistyles(Animated.View);

const $ = StyleSheet.create((theme) => ({
  page: { flex: 1, backgroundColor: theme.colors.page, paddingTop: 64, paddingHorizontal: 12, gap: 4 },
  label: { color: theme.colors.text, fontSize: 12 },
  box: { width: 40, height: 40, borderRadius: 8, backgroundColor: theme.colors.box },
}));

export default function App() {
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(withTiming(200, { duration: 1200 }), -1, true);
  }, [x]);

  // Carries its own size and colour, so it is visible on its own.
  const sized = useAnimatedStyle(() => ({
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#8e24aa",
    opacity: 0.4 + x.value / 330,
  }));
  // Only movement: invisible unless another style gives the box a size.
  const moving = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const cases = [
    ["a. animated alone (works)", sized],
    ["b. [static, animated] (static lost)", [$.box, moving]],
    ["c. [animated, animated] (first lost)", [sized, moving]],
    ["d. [animated, static] (static lost)", [moving, $.box]],
  ] as const;

  return (
    <View style={$.page}>
      <Text style={$.label}>withUnistyles(Animated.View)</Text>
      {cases.map(([label, style], i) => (
        <View key={label}>
          <Text style={$.label}>{label}</Text>
          <UniAnimatedView style={style as never} testID={`box-${"abcd"[i]}`} />
        </View>
      ))}
    </View>
  );
}
