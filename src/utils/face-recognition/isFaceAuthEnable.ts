import { checkFaceAuthEnable } from "@/lib/api/checkFaceAuthEnable";
import { useQuery } from "@tanstack/react-query";

export function isFaceAuthEnablePublic(public_id: string) {
    return useQuery({
        queryKey: ['isFaceAuthEnable', public_id],
        queryFn: () => checkFaceAuthEnable(public_id),
        enabled: !!public_id,
    });
}