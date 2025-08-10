export type Palette = {
  isDark: boolean;
  baseBg: string;
  glassBg: string;
  borderCol: string;
  textSoft: string;
  cardBg: string;
};

export function makePalette(isDark: boolean): Palette {
  return {
    isDark,
    baseBg: isDark
      ? "linear-gradient(135deg, #0c0f14 0%, #121826 40%, #1b2a41 100%)"
      : "linear-gradient(135deg, #fdfcff 0%, #f1f6ff 40%, #eaf6ff 100%)",
    glassBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
    borderCol: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    textSoft: isDark ? "#cfd8ff" : "#455a64",
    cardBg: isDark ? "#141a26" : "#ffffff",
  };
}
