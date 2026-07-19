import React from 'react';
import Skeleton from '../../Skeleton';

const StatsCard = ({ icon, title, value, isLoading }) => {
    if (isLoading) {
        return <Skeleton className="h-28 w-full" />;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;