export const Colors = {
  bg: '#0a0a0a',
  bgCard: '#161616',
  bgElevated: '#1e1e1e',
  bgInput: '#1a1a1a',

  accent: '#f97316',
  accentLight: '#fb923c',
  accentDark: '#ea580c',
  accentMuted: 'rgba(249,115,22,0.15)',

  text: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',

  success: '#22c55e',
  successMuted: 'rgba(34,197,94,0.15)',
  danger: '#ef4444',
  dangerMuted: 'rgba(239,68,68,0.15)',
  warning: '#eab308',
  info: '#3b82f6',

  border: '#2a2a2a',
  borderLight: '#333333',

  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.6)',

  star: '#fbbf24',
  starEmpty: '#374151',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Font = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
} as const;
