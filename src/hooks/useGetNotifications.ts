import { useQuery } from "@tanstack/react-query";

export function useGetNotifications(hubId: string) {
    return useQuery({
        queryKey: ['notifications', hubId],
        queryFn: async () => {
            const res = await fetch(`/api/hub/${hubId}/notifications`);
            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }
            return res.json();
        },
        enabled: !!hubId,
    });
}
