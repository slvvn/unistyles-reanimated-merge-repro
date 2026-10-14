import { StyleSheet } from "react-native-unistyles";

const light = { colors: { box: "#1e88e5", text: "#111", page: "#fff" } } as const;
const dark = { colors: { box: "#fb8c00", text: "#eee", page: "#111" } } as const;

type AppThemes = { light: typeof light; dark: typeof dark };
declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({ themes: { light, dark }, settings: { initialTheme: "light" } });
