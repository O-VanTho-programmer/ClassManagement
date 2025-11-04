import { useUser } from "@/context/UserContext";
import { fetchClassByUserId } from "@/lib/api/fetchClassByUserId";
import { useQuery } from "@tanstack/react-query";

export function useGetClassByUserId() {
    const user = useUser();

    return useQuery({
        queryKey: ['get_class_by_user_id', user?.userId],
        queryFn: () => fetchClassByUserId(user?.userId),
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.userId,
    })
}