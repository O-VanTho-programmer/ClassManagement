export default function getHubStatsSum(userHubs: Hub[]) {
    const hubStats = [
        {
            value: userHubs.length,
            label: 'Total Hubs',
            color: 'blue' as const,
        },
        {
            value: userHubs.reduce((sum, hub) => sum + hub.NumberOfClasses, 0),
            label: 'Total Classes',
            color: 'green' as const,
        },
        {
            value: userHubs.reduce((sum, hub) => sum + hub.NumberOfTeachers, 0),
            label: 'Teachers',
            color: 'purple' as const,
        },
        {
            value: userHubs.filter(hub => hub.Owner === 'Current User').length,
            label: 'Owned by Me',
            color: 'orange' as const,
        },
    ];

    return hubStats;
}