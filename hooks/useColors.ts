import { useThemeStore } from "@/stores/themeStore"
import { colors } from "@/constants/theme"

export const useColors = () => {
  const theme = useThemeStore((state) => state.theme)
  return colors[theme]
}
