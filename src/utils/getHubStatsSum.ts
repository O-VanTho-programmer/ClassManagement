import { Hub } from "@/types/Hub";

export default function getHubStatsSum(userHubs: Hub[], currentUserName: string) {
    const hubStats = [
        {
            value: userHubs.length,
            label: 'Total Hubs',
            color: 'blue' as const,
        },
        {
            value: userHubs.reduce((sum, hub) => sum + hub.numberOfClasses, 0),
            label: 'Total Classes',
            color: 'green' as const,
        },
        {
            value: userHubs.reduce((sum, hub) => sum + hub.numberOfTeachers, 0),
            label: 'Teachers',
            color: 'purple' as const,
        },
        {
            value: userHubs.filter(hub => hub.owner.match(currentUserName)).length,
            label: 'Owned by Me',
            color: 'orange' as const,
        },
    ];

    return hubStats;
}