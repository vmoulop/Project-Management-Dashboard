import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProject } from '../features/projects/projectsSlice';
import { addProjectEvent } from '../features/projects/projectsSlice';

export default function useProjectSSE() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect to the SSE endpoint
    const events = new EventSource('http://localhost:8000/events/');

    events.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle project progress update
        if (data.type === 'progress_update') {
          dispatch(updateProject({
            id: data.project_id,
            data: { progress: data.progress }
          }));
        }

        // Handle new activity events
        if (data.type === 'new_activity') {
         dispatch(addProjectEvent({
          projectId: data.project_id,
          event: { description: data.description, created_by: data.created_by, created_at: data.created_at }
         }));
        }

      } catch (err) {
        console.error('Error parsing SSE event', err);
      }
    };

    events.onerror = (err) => {
      console.error('SSE connection error', err);
      events.close();
    };

    return () => events.close(); // cleanup on unmount
  }, [dispatch]);
}
