import React from 'react';
import { Container, Typography } from '@mui/material';
import ProjectList from '../components/ProjectList';

export default function ProjectsPage() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Projects
      </Typography>
      <ProjectList />
    </Container>
  );
}