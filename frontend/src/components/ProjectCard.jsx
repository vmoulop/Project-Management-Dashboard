import { Card, CardContent, Typography, Chip, LinearProgress, Stack, Button, Checkbox, Box } from '@mui/material';

export default function ProjectCard({
  project={project},
  onClick={setSelectedProject},
  onEdit={handleEdit},
  onDelete={handleDelete},
  onRecover={handleRecover},
  onSelect,      // for bulk selection
  selected = false, // whether this project is currently selected
}) {

  const healthColors = {
  green: '#4caf50',
  yellow: '#ffeb3b',
  red: '#f44336',
  };

  const healthColor = healthColors[project.health] || '#9e9e9e';

  return (
    <Card sx={{ mb: 2, height: '100%', display: 'flex', flexDirection: 'column', }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox
            checked={selected}
            onChange={() => onSelect(project.id)}
            inputProps={{ 'aria-label': 'Select project' }}
          />
          <Typography variant="h6">{project.title}</Typography>
        </Stack>

        <Typography variant="body2">{project.short_description}</Typography>
        <Typography variant="caption">Owner: {project.owner}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
          {project.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Stack>

        <LinearProgress variant="determinate" value={parseFloat(project.progress)} />
        <Typography variant="body2" color="text.secondary" align="center">
          {`${Math.round(project.progress)}%`}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}></Box>
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Satus: {project.status_display} | Last Updated: {new Date(project.last_updated).toLocaleString()}
          </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="caption" sx={{ mr: 1 }}>
                Health:
              </Typography>

              {/* Health bar */}
              <Box
                sx={{
                  width: 60,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  overflow: 'hidden',
                }}
              >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: healthColor,
                }}
              />
              </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => onEdit(project)}>Edit</Button>
          <Button variant="contained" color="primary" onClick={() => onClick(project)}>View</Button>
          {!project.deleted
            ? <Button color="error" onClick={() => onDelete(project.id)}>Delete</Button>
            : <Button color="success" onClick={() => onRecover(project.id)}>Recover</Button>
          }
        </Stack>
      </CardContent>
    </Card>
  );
}
