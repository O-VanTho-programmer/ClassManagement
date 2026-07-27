import api from "@/lib/axios";
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
      const res = await api.patch(`/hub/${hubId}/notifications`, { ids, action });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate query to pull the latest state
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.hubId] });
    },
  });
}
