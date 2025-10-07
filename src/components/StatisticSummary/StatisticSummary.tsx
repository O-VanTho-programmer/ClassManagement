import React from 'react';

export interface StatisticsProps {
    stats: StatItem[];
    columns?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    cardClassName?: string;
    valueClassName?: string;
    labelClassName?: string;
}

const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600',
};

const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
};

export default function Statistics({
    stats,
    columns = 4,
    className = '',
    cardClassName = '',
    valueClassName = '',
    labelClassName = ''
}: StatisticsProps) {
    return (
        <div className={`grid ${gridColumns[columns]} gap-6 ${className}`}>
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    stat={stat}
                    cardClassName={cardClassName}
                    valueClassName={valueClassName}
                    labelClassName={labelClassName}
                />
            ))}
        </div>
    );
}

export interface StatItem {
    value: number | string;
    label: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'indigo' | 'pink';
    icon?: React.ReactNode;
}

interface StatCardProps {
    stat: StatItem;
    cardClassName?: string;
    valueClassName?: string;
    labelClassName?: string;
}

function StatCard({ stat, cardClassName, valueClassName, labelClassName }: StatCardProps) {
    const colorClass = colorClasses[stat.color || 'blue'];

    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 text-center ${cardClassName}`}>
            {stat.icon && (
                <div className="flex justify-center mb-3">
                    {stat.icon}
                </div>
            )}
            <div className={`text-3xl font-bold mb-2 ${colorClass} ${valueClassName}`}>
                {stat.value}
            </div>
            <div className={`text-gray-600 font-medium ${labelClassName}`}>
                {stat.label}
            </div>
        </div>
    );
}