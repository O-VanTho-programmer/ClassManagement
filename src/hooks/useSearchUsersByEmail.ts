import { searchUsersByEmailAPI } from "@/lib/api/searchUsersByEmailAPI";
import { useQuery } from "@tanstack/react-query";

export const useSearchUsersByEmail = (searchTerm: string) => {
    return useQuery({
        queryKey: ['userSearch', searchTerm],
        queryFn: () => searchUsersByEmailAPI(searchTerm),
        enabled: searchTerm.length >= 3,
    });
}