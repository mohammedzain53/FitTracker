import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2ECC71',
        light: '#58D68D',
        dark: '#27AE60',
      },
      secondary: {
        main: '#3498DB',
        light: '#5DADE2',
        dark: '#2980B9',
      },
      success: {
        main: '#2ECC71',
        light: '#58D68D',
        dark: '#27AE60',
      },
      warning: {
        main: '#FF6B35',
        light: '#FF8C69',
        dark: '#E55A2B',
      },
      error: {
        main: '#E74C3C',
        light: '#EC7063',
        dark: '#C0392B',
      },
      background: {
        default: 'linear-gradient(135deg, #F9FAFB 0%, #E8F1F5 50%, #F0F8FF 100%)',
        paper: 'rgba(255, 255, 255, 0.9)',
      },
      text: {
        primary: '#2C3E50',
        secondary: '#34495E',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '3rem',
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.25rem',
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.875rem',
        letterSpacing: '-0.025em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.025em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '-0.025em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        letterSpacing: '-0.025em',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 10px 25px -5px rgba(46, 204, 113, 0.1), 0 5px 10px -5px rgba(52, 152, 219, 0.1)',
            borderRadius: 20,
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(46, 204, 113, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px -12px rgba(46, 204, 113, 0.2), 0 0 20px rgba(52, 152, 219, 0.15)',
              border: '1px solid rgba(52, 152, 219, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '12px 24px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 16,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(46, 204, 113, 0.1)',
            boxShadow: '0 8px 25px rgba(46, 204, 113, 0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 500,
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#FF1744',
        light: '#FF5983',
        dark: '#D50000',
      },
      secondary: {
        main: '#C0C0C0',
        light: '#E0E0E0',
        dark: '#9E9E9E',
      },
      success: {
        main: '#FFD600',
        light: '#FFEB3B',
        dark: '#FFC107',
      },
      warning: {
        main: '#FFD600',
        light: '#FFEB3B',
        dark: '#FFC107',
      },
      error: {
        main: '#FF1744',
        light: '#FF5983',
        dark: '#D50000',
      },
      background: {
        default: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        paper: 'rgba(44, 83, 100, 0.8)',
      },
      text: {
        primary: '#C0C0C0',
        secondary: '#E0E0E0',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '3rem',
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.25rem',
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.875rem',
        letterSpacing: '-0.025em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.025em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '-0.025em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        letterSpacing: '-0.025em',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            borderRadius: 20,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '12px 24px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            border: '1px solid rgba(148, 163, 184, 0.1)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 500,
          },
        },
      },
    },
  });

  const theme = darkMode ? darkTheme : lightTheme;

  const value = {
    darkMode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};