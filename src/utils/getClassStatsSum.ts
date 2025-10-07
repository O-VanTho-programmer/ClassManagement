export default function getClassStatsSum(stats: any) {
    const classStats = [
        {
            value: stats.total,
            label: 'Total Classes',
            color: 'blue' as const,
        },
        {
            value: stats.active,
            label: 'Active Classes',
            color: 'green' as const,
        },
        {
            value: stats.students,
            label: 'Total Students',
            color: 'purple' as const,
        },
    ];


    return classStats;
}