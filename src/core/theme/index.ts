import { Platform, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/news/store';

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
  overlay: string;
}

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800';
  fontFamily: string;
  letterSpacing?: number;
}

export interface ThemeTypography {
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  bodyLarge: TypographyStyle;
  bodyMedium: TypographyStyle;
  bodySmall: TypographyStyle;
  caption: TypographyStyle;
  button: TypographyStyle;
}

export interface ThemeSpacing {
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeRadius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  full: number;
}

export interface ThemeShadow {
  light: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  medium: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadow;
}

const lightColors: ThemeColors = {
  primary: '#312E81', // Deep Indigo
  accent: '#06B6D4', // Electric Cyan
  background: '#F8FAFC', // Soft Neutral
  surface: '#FFFFFF',
  cardBg: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  shadow: 'rgba(15, 23, 42, 0.08)',
  overlay: 'rgba(15, 23, 42, 0.4)',
};

const darkColors: ThemeColors = {
  primary: '#6366F1', // Indigo Accent
  accent: '#22D3EE', // Cyan Accent
  background: '#0F172A', // Dark Slate
  surface: '#1E293B', // Elevated Surface
  cardBg: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

// Spacing System
const spacing: ThemeSpacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius System
const radius: ThemeRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

const fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) || 'serif',
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }) || 'sans-serif',
  sansMedium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'sans-serif' }) || 'sans-serif',
};

// Accessibility-First Typography System (Responsive Scale hints)
const typography: ThemeTypography = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    fontFamily: fonts.serif,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: fonts.serif,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: fonts.serif,
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: fonts.sans,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: fonts.sans,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    fontFamily: fonts.sans,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    fontFamily: fonts.sansMedium,
    letterSpacing: 0.5,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: fonts.sansMedium,
    letterSpacing: 0.2,
  },
};

// Shadow Systems
const shadows = (dark: boolean): ThemeShadow => ({
  light: {
    shadowColor: dark ? '#000000' : '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: dark ? 0.3 : 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: dark ? '#000000' : '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: dark ? 0.4 : 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
});

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  spacing,
  radius,
  typography,
  shadows: shadows(false),
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  spacing,
  radius,
  typography,
  shadows: shadows(true),
};

export const useAppTheme = (): Theme => {
  try {
    const themeMode = useSelector((state: RootState) => state.news?.themeMode || 'light');
    return themeMode === 'dark' ? darkTheme : lightTheme;
  } catch (e) {
    return lightTheme;
  }
};
