import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ filters = {}, ordering = 'last_updated', search = '' } = {}) => {
    let url = 'http://localhost:8000/api/projects/?';

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          url += `${key}=${filters[key]}&`;
        }
      });
    }
    if (ordering) {
      url += `ordering=${ordering}&`;
    }
    if (search) {
      url += `search=${search}&`;
    }
    if (filters.tags) {
      url += `tags=${filters.tags}&`;
    }

    const response = await axios.get(url);
    return response.data.results; // .results for DRF pagination
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData) => {
    const response = await axios.post('http://localhost:8000/api/projects/', projectData);
    return response.data;
  }
);


// Async thunk to soft delete
export const softDeleteProject = createAsyncThunk(
  'projects/softDeleteProject',
  async (projectId) => {
    const response = await axios.delete(`http://localhost:8000/api/projects/${projectId}/`);
    return projectId;
  }
);

// Async thunk to recover
export const recoverProject = createAsyncThunk(
  'projects/recoverProject',
  async (projectId) => {
    const response = await axios.post(`http://localhost:8000/api/projects/${projectId}/recover/`);
    return response.data;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }) => {
    const response = await axios.put(`http://localhost:8000/api/projects/${id}/`, data);
    return response.data;
  }
);

export const bulkUpdateProjects = createAsyncThunk(
  'projects/bulkUpdateProjects',
  async ({ projectIds, status, tags, version }) => {
    const response = await axios.post('http://localhost:8000/api/projects/bulk_update/', {
      project_ids: projectIds,
      status,
      tags,
      version
    });
    return { projectIds, status, tags }; // Return info to update Redux state
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    status: 'idle',
    filters: { status: '', owner: '', tags: '', health: '' },
    ordering: 'last_updated',
  },
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setOrdering(state, action) {
      state.ordering = action.payload;
    },
    addProjectEvent(state, action) {
      const { projectId, event } = action.payload;
      const project = state.list.find(p => p.id === projectId);
      if (project) {
        project.events.push(event);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(softDeleteProject.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p.id === action.payload);
        if (index !== -1) state.list[index].deleted = true;
      })
      .addCase(recoverProject.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
        state.list[index] = action.payload;
        }
      })
      .addCase(bulkUpdateProjects.fulfilled, (state, action) => {
        const { projectIds, status, tags } = action.payload;
        state.list = state.list.map(project => {
          if (projectIds.includes(project.id)) {
            return {
              ...project,
              status: status ?? project.status,
              tags: tags ?? project.tags,
              version: project.version + 1
          };
        }
        return project;
      });
      });;
  },
});

export const { setFilter, setOrdering, addProjectEvent } = projectsSlice.actions;
export default projectsSlice.reducer;
