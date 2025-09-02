// src/theme/ThemeProvider.jsx
import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeContext = createContext(null);
export const useThemeCtx = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const theme = useTheme();
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
