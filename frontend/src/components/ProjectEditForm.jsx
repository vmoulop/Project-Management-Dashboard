import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

export default function ProjectEditForm({ project, onClose, onUpdated }) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.short_description);
  const [owner, setOwner] = useState(project.owner);
  const [tags, setTags] = useState(project.tags.join(','));
  const [health, setHealth] = useState(project.health);
  const [status, setStatus] = useState(project.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:8000/api/projects/${project.id}/`, {
        title,
        short_description: description,
        owner,
        tags: tags.split(',').map(t => t.trim()),
        health,
        status
      });
      onUpdated(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update project.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
      <TextField label="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <TextField label="Health" value={health} onChange={(e) => setHealth(e.target.value)} />
      <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
      <Button type="submit" variant="contained">Save</Button>
      <Button variant="text" onClick={onClose}>Cancel</Button>
    </Box>
  );
}
