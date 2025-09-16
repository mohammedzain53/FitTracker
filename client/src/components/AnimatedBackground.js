import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBackground = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
          : 'linear-gradient(135deg, #F9FAFB 0%, #E8F1F5 50%, #F0F8FF 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? `radial-gradient(circle at 20% 80%, rgba(255, 23, 68, 0.4) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(192, 192, 192, 0.2) 0%, transparent 50%),
               radial-gradient(circle at 40% 40%, rgba(255, 214, 0, 0.3) 0%, transparent 50%)`
            : `radial-gradient(circle at 20% 80%, rgba(46, 204, 113, 0.3) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.3) 0%, transparent 50%),
               radial-gradient(circle at 40% 40%, rgba(255, 107, 53, 0.2) 0%, transparent 50%)`,
          animation: 'float 20s ease-in-out infinite',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'rgba(15, 23, 42, 0.1)'
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(1px)',
          zIndex: 1,
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '33%': {
            transform: 'translateY(-30px) rotate(120deg)',
          },
          '66%': {
            transform: 'translateY(-60px) rotate(240deg)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2, pt: '80px' }}>
        {children}
      </Box>
    </Box>
  );
};

export default AnimatedBackground;