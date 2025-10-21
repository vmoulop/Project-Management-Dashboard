import React from 'react';
import { Container, Typography, Stack, Avatar, Box  } from '@mui/material';
import ProjectList from '../components/ProjectList';
import FolderIcon from '@mui/icons-material/Folder';


export default function ProjectsPage() {
  return (
    <Container>
      <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
      <Typography variant="h4" sx={{ mb: 2 }}>
        Project Board
      </Typography>
      <ProjectList />
    </Container>
  );
}