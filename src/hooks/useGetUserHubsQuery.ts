import { fetchHubs } from "@/lib/api/fetchHubs";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";

export const useGetUserHubsQuery = () => {
    const user = useUser();
    
    return useQuery({
        queryKey: ["hubs", user?.userId],
        queryFn: () => fetchHubs(user?.userId),
        staleTime: 1000 * 60 * 5,
        enabled: !!user?.userId, // Only run query when user is available
    });
};
