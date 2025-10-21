import ProjectsPage from './pages/ProjectsPage';
import './App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ProjectList from './components/ProjectList';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectDetailPage from './components/ProjectDetailPage';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Default page - project list */}
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;