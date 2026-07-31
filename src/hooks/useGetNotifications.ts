import api from "@/lib/axios";
import { NotificationSchema } from "@/types/Notification";
import { useQuery } from "@tanstack/react-query";

export function useGetNotifications(hubId: string) {
    return useQuery({
        queryKey: ['notifications', hubId],
        queryFn: async (): Promise<NotificationSchema[]> => {
            const res = await api.get<NotificationSchema[]>(`/hub/${hubId}/notifications`);
            return res.data;
        },
        enabled: !!hubId,
    });
}
