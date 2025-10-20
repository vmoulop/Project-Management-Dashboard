import { Card, CardContent, Typography, Chip, LinearProgress, Stack, Button, Checkbox } from '@mui/material';

export default function ProjectCard({
  project={project},
  onClick={setSelectedProject},
  onEdit={handleEdit},
  onDelete={handleDelete},
  onRecover={handleRecover},
  onSelect,      // for bulk selection
  selected = false, // whether this project is currently selected
}) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
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
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          Health: {project.health} | Last Updated: {new Date(project.last_updated).toLocaleString()}
        </Typography>

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
