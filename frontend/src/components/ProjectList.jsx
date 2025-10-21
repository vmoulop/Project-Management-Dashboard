import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, setFilter, setOrdering, createProject, softDeleteProject, recoverProject, updateProject } from '../features/projects/projectsSlice';
import ProjectCard from './ProjectCard';
import ProjectDetailPage from './ProjectDetailPage';
import ProjectForm from './ProjectForm';
import { Grid, MenuItem, Select, TextField, Box, Button, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { Pagination } from '@mui/material';

export default function ProjectList() {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.list);
  const filters = useSelector(state => state.projects.filters);
  const ordering = useSelector(state => state.projects.ordering);
  const page = useSelector(state => state.projects.page);
  const totalPages = useSelector(state => state.projects.totalPages);

  const [creating, setCreating] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);

  const handleCreate = (data) => {
    dispatch(createProject(data));
    setCreating(false);
  };

  const handleUpdate = (data) => {
    dispatch(updateProject({ id: editingProject.id, data }));
    setEditingProject(null);
  };

  const handleEdit = (project) => setEditingProject(project);

  const handleDelete = (id) => {
    console.log('Deleting project', id);
    dispatch(softDeleteProject(id));
  };

  const handleRecover = (id) => {
    console.log('Recovering project', id);
    dispatch(recoverProject(id));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchProjects({ filters, ordering, search: searchText, page: newPage }));
  };

  const fetchSuggestions = (query) => {
  };

  const handleClearSearch = () => setSearchText('');

  // Bulk selection toggle
  const handleSelectProject = (projectId) => {
    setSelectedProjectIds(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Bulk update example
  const handleBulkUpdateStatus = (newStatus) => {
    selectedProjectIds.forEach(id => {
      const project = projects.find(p => p.id === id);
      if (project) {
        dispatch(updateProject({ id, data: { ...project, status: newStatus } }));
      }
    });
    setSelectedProjectIds([]);
  };

  useEffect(() => {
    dispatch(fetchProjects({ filters, ordering, search: searchText }));
  }, [filters, ordering, searchText, dispatch]);

  if (selectedProject) {
    return <ProjectDetailPage project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  const owners = [...new Set(projects.map(p => p.owner))];
  const tags = [...new Set(projects.flatMap(p => p.tags))];

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={() => setCreating(true)}>New Project</Button>

        <Autocomplete
          freeSolo
          disableClearable
          options={suggestions}
          inputValue={searchText}
          onInputChange={(event, newInputValue) => {
            setSearchText(newInputValue);
            fetchSuggestions(newInputValue);
          }}
          onChange={(event, newValue) => {
            setSearchText(newValue || '');
            dispatch(fetchProjects({ filters, ordering, search: newValue || '' }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Projects"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {searchText && (
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                ),
              }}
            />
          )}
          sx={{ width: 300 }}
        />

        {/* Filters */}
        <Select value={filters.owner} onChange={(e) => dispatch(setFilter({ owner: e.target.value }))} displayEmpty>
          <MenuItem value="">All Owners</MenuItem>
          {owners.map(owner => <MenuItem key={owner} value={owner}>{owner}</MenuItem>)}
        </Select>

        <Select value={filters.tags} onChange={(e) => dispatch(setFilter({ tags: e.target.value }))} displayEmpty>
          <MenuItem value="">All Tags</MenuItem>
          {tags.map(tag => <MenuItem key={tag} value={tag}>{tag}</MenuItem>)}
        </Select>

        <Select value={filters.status} onChange={(e) => dispatch(setFilter({ status: e.target.value }))} displayEmpty>
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="not_started">Not Started</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>

        <Select value={filters.health} onChange={(e) => dispatch(setFilter({ health: e.target.value }))} displayEmpty>
          <MenuItem value="">All Health</MenuItem>
          <MenuItem value="green">Green</MenuItem>
          <MenuItem value="yellow">Yellow</MenuItem>
          <MenuItem value="red">Red</MenuItem>
        </Select>

        <Select value={ordering} onChange={(e) => dispatch(setOrdering(e.target.value))}>
          <MenuItem value="last_updated">Last Updated</MenuItem>
          <MenuItem value="progress">Progress</MenuItem>
          <MenuItem value="health">Health</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </Select>
      </Box>

      {/* Bulk action buttons */}
      {selectedProjectIds.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" onClick={() => handleBulkUpdateStatus('not_started')}>Mark Not Started</Button>
          <Button variant="contained" onClick={() => handleBulkUpdateStatus('in_progress')}>Mark In Progress</Button>
          <Button variant="contained" onClick={() => handleBulkUpdateStatus('completed')}>Mark Completed</Button>
        </Stack>
      )}

      {creating && <ProjectForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />}
      {editingProject && <ProjectForm initialData={editingProject} onSubmit={handleUpdate} onCancel={() => setEditingProject(null)} />}

      <Grid container spacing={2} alignItems="stretch">
        {projects.map(project => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCard
              project={project}
              onClick={setSelectedProject}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRecover={handleRecover}
              onSelect={handleSelectProject}
              selected={selectedProjectIds.includes(project.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => handlePageChange(value)}
          color="primary"
          hidePrevButton
          hideNextButton
        />
</Box>

    </>
  );
}
