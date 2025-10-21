import ProjectsPage from './pages/ProjectsPage';
import './App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ProjectList from './components/ProjectList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProjectsPage />
    </ThemeProvider>
  );
}

export default App;