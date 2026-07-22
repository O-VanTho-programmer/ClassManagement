import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateNotificationsParams {
  hubId: string;
  ids: number[];
  action: 'read' | 'unread' | 'star' | 'unstar' | 'trash' | 'restore';
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ hubId, ids, action }: UpdateNotificationsParams) => {
      const res = await fetch(`/api/hub/${hubId}/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update notifications with action: ${action}`);
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      // Invalidate query to pull the latest state
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.hubId] });
    },
  });
}
