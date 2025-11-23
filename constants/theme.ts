import { scale, verticalScale } from "@/utils/style";


export const colors = {
  light: {
    background: "#FFFFFF",
    card: "#F0F8F4",

    primary: "#46D96B",        // lighter green
    primaryDark: "#3FC35A",    // lighter dark-green
    text: "#1A1A1A",
    textSecondary: "#4B5563",
    border: "#E5E7EB",
    highlight: "#F0FBF4",      // softer mint

    timeText: "rgba(0,0,0,0.45)",
    statusText: "rgba(0,0,0,0.45)",

    link: "#1A9146",           // slightly lighter deep green
    linkHighlight: "#1F7A40",  // lighter press state
  },

  dark: {
    background: "#0E0F0E",
    card: "#1A1D1A",

    primary: "#46D96B",
    primaryDark: "#3FC35A",

    text: "#FFFFFF",
    textSecondary: "#D4D4D4",
    border: "#2D2D2D",
    highlight: "#1C2A20",

    timeText: "rgba(255,255,255,0.45)",
    statusText: "rgba(255,255,255,0.45)",

    link: "#68EE9A",
    linkHighlight: "#34D96C",
  },
};
export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
  _70: verticalScale(70),
  _80: verticalScale(80),
  _90: verticalScale(90),
  full: 200,
};
