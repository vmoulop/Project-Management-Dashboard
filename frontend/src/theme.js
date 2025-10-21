import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    success: { main: '#4caf50' },
    warning: { main: '#ffeb3b' },
    error: { main: '#f44336' },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

export default theme;