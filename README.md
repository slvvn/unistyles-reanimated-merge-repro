# withUnistyles(Animated.View) drops styles merged with an animated style

Versions: react-native-unistyles 3.5.2, react-native-nitro-modules 0.37.1, react-native-reanimated 4.7.1, react-native-worklets 0.13.0, expo 57.0.12, react-native 0.86.2. Seen on the iOS 26.5 simulator and an Android 11 (API 30) emulator; first found on unistyles 3.3.0 with reanimated 4.5.1.

```bash
pnpm install
pnpm ios      # or: pnpm android
```

![Each case passes the same style to Animated.View (left) and withUnistyles(Animated.View) (right). Only case a renders on the right; b–d stay empty while the left boxes move.](expected-vs-actual.gif)

react-native-unistyles 3.5.2 on the iOS 26.5 simulator. Each row passes the same `style` to a plain `Animated.View` (left, what it should look like) and to `withUnistyles(Animated.View)` (right). The dashed outline marks where the box should be.

`src/App.tsx` renders four cases on both components. On the `withUnistyles(Animated.View)` side:

| Case | `style` | Expected | Actual |
|---|---|---|---|
| a | `animated` | purple pulsing box | purple pulsing box |
| b | `[static, animated]` | blue moving box | nothing: static style dropped, transform still applied |
| c | `[animated, animated]` | purple moving box | nothing: first animated style dropped |
| d | `[animated, static]` | blue moving box | nothing: static style dropped |

The same arrays on a plain `Animated.View`, or on `Animated.createAnimatedComponent(withUnistyles(View))`, render correctly.

Cause: `getSecrets` in `src/core/withUnistyles/withUnistyles.native.tsx` merges the style array into one object with `Object.assign`. The merged object picks up the animated style's `viewDescriptors`, so Reanimated treats the whole object as an animated style and ignores the other keys; a second animated style overwrites the first one's keys.
