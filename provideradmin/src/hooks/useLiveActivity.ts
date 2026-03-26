import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { LiveActivity } from '@/schema';

export const useLiveActivity = (ownerId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['live-activities', ownerId];

  const query = useQuery<Notification[]>({
    queryKey,
    queryFn: () => [], // Start empty
    initialData: [],
    enabled: !!ownerId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!ownerId) return;

    // Connect to NestJS SSE
    const eventSource = new EventSource(
      `http://localhost:3000/parking-avenue-owner/live-activity?ownerId=${ownerId}`
    );

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const rawEvent = payload.data; 

      // Transform the SSE event into your "Notification" type
      const newNotification: LiveActivity = {
        type: rawEvent.type,
        message: rawEvent.message,
        timestamp: new Date(),
        metadata: rawEvent.metadata,
      };

      queryClient.setQueryData<LiveActivity[]>(queryKey, (old = []) => {
        return [newNotification, ...old].slice(0, 10); 
      });
    };

    eventSource.onerror = () => eventSource.close();
    return () => eventSource.close();
  }, [ownerId, queryClient, queryKey]);

  return query;
};