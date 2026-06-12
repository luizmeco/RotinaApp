import tailwindConfig from "../../tailwind.config";

const colors = (tailwindConfig?.theme?.extend?.colors ?? {}) as Record<
  string,
  string
>;

export function useThemeColors() {
  return colors;
}
