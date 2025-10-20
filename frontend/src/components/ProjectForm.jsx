import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Stack } from '@mui/material';

export default function ProjectForm({ initialData = {}, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [shortDescription, setShortDescription] = useState(initialData.short_description || '');
  const [owner, setOwner] = useState(initialData.owner || '');
  const [status, setStatus] = useState(initialData.status || 'not_started');
  const [health, setHealth] = useState(initialData.health || 'green');
  const [tags, setTags] = useState(initialData.tags ? initialData.tags.join(', ') : '');
  const [progress, setProgress] = useState(initialData.progress || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: initialData.id,
      title,
      short_description: shortDescription,
      owner,
      status,
      health,
      progress,
      tags: tags.split(',').map(t => t.trim()),
    };
    if (initialData.version) {
      payload.version = initialData.version; // for updates
    }
    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <Stack spacing={2}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField label="Short Description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required />
        <TextField label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} required />
        <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="not_started">Not Started</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
        <TextField select label="Health" value={health} onChange={(e) => setHealth(e.target.value)}>
          <MenuItem value="green">Green</MenuItem>
          <MenuItem value="yellow">Yellow</MenuItem>
          <MenuItem value="red">Red</MenuItem>
        </TextField>
        <TextField label="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <TextField label="Progress (%)" type="number" value={progress} onChange={(e) => setProgress(e.target.value)} />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">Save</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </Stack>
      </Stack>
    </Box>
  );
}