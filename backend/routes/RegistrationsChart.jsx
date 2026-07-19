import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Skeleton from '../../Skeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RegistrationsChart = ({ chartData, isLoading }) => {
    if (isLoading) {
        return <Skeleton className="h-80 w-full" />;
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Số lượng đăng ký mới trong 7 ngày qua' },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
            <Line options={options} data={chartData} />
        </div>
    );
};

export default RegistrationsChart;