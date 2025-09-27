// Centralized color palette for the app
// Extend this object with any new brand or UI colors and import where needed.
// Example usage:
//   import { colors } from '@/lib/colors'
//   <div style={{ backgroundColor: colors.charcoal }} />

export const colors = {
  charcoal: '#1F1F1F',
  brandGreen: '#1CA64D', // Tailwind green-600
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorName = keyof typeof colors;

export function getColor(name: ColorName) {
  return colors[name];
}
