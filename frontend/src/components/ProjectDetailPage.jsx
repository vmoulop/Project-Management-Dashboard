import React from 'react';
import { Container, Typography, Card, CardContent, LinearProgress, Chip, Stack, Button, Divider, Grid } from '@mui/material';

export default function ProjectDetailPage({ project, onBack }) {
  return (
    <Container sx={{ mt: 2 }}>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
        Back to Projects
      </Button>

      <Typography variant="h4" sx={{ mb: 2 }}>{project.title}</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>{project.short_description}</Typography>
      <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
        Owner: {project.owner} | Last Updated: {new Date(project.last_updated).toLocaleString()} | Health: {project.health}
      </Typography>
      <LinearProgress variant="determinate" value={parseFloat(project.progress)} sx={{ mb: 3 }} />

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Milestones</Typography>
      {project.milestones.length === 0 && <Typography variant="body2">No milestones</Typography>}
      {project.milestones.map((ms) => (
        <Card key={ms.id} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="subtitle1">{ms.title}</Typography>
            <Typography variant="body2">{ms.description}</Typography>
            <Typography variant="caption">
              Due: {ms.due_date} | Progress: {ms.progress}%
            </Typography>
            <LinearProgress variant="determinate" value={parseFloat(ms.progress)} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Team</Typography>
      {project.team.length === 0 && <Typography variant="body2">No team members</Typography>}
      <Grid container spacing={2}>
        {project.team.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{member.name}</Typography>
                <Typography variant="body2">Role: {member.role}</Typography>
                <Typography variant="body2">Capacity: {member.capacity_percent}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Recent Events</Typography>
      {project.events.length === 0 && <Typography variant="body2">No events</Typography>}
      {project.events.map((event) => (
        <Card key={event.id} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="body2">{event.description}</Typography>
            <Typography variant="caption">
              By {event.created_by} at {new Date(event.created_at).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
