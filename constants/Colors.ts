const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

export const theme = {
  primary: {
    main: "#00BF6D", //"#3777F0", //0xFF00BF6D
  },
  grey: {
    ultraLightGrey: "#F2F2F2",
    lightgrey: "#D3D3D3",
    default: "grey",
  },
  black: {
    default: "#000",
  },
  white: {
    default: "#FFF",
  },
  text: {
    lightTheme: {
      default: "#A4A4A6",
    },
  },
  warning: {
    default: "#F3BB1C"
  },
  error: {
    default: "#F03738"
  }
};
