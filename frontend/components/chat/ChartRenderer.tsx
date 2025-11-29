"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

interface ChartData {
    type: "chart";
    chartType: "doughnut" | "bar" | "line";
    title: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string | string[];
            borderColor?: string;
        }[];
    };
}

interface ChartRendererProps {
    chartData: ChartData;
}

export function ChartRenderer({ chartData }: ChartRendererProps) {
    console.log('ChartRenderer received data:', chartData);
    
    if (!chartData || !chartData.data) {
        console.error('Invalid chart data:', chartData);
        return <div style={{ color: 'red' }}>Invalid chart data</div>;
    }
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#a0aec0',
                    font: {
                        family: 'Space Grotesk',
                        size: 12
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(11, 14, 20, 0.95)',
                titleColor: '#95E1D3',
                bodyColor: '#ffffff',
                borderColor: '#95E1D3',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || context.raw;
                        return `${label}: ₹${value.toLocaleString('en-IN')}`;
                    }
                }
            }
        },
        scales: chartData.chartType !== 'doughnut' ? {
            y: {
                ticks: {
                    color: '#a0aec0',
                    font: {
                        family: 'Space Grotesk',
                        size: 10
                    },
                    callback: function(value: any) {
                        return '₹' + value.toLocaleString('en-IN');
                    }
                },
                grid: {
                    color: 'rgba(160, 174, 192, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: '#a0aec0',
                    font: {
                        family: 'Space Grotesk',
                        size: 10
                    }
                },
                grid: {
                    display: false
                }
            }
        } : undefined
    };

    const renderChart = () => {
        switch (chartData.chartType) {
            case 'doughnut':
                return <Doughnut data={chartData.data} options={chartOptions} />;
            case 'bar':
                return <Bar data={chartData.data} options={chartOptions} />;
            case 'line':
                return <Line data={chartData.data} options={chartOptions} />;
            default:
                return null;
        }
    };

    return (
        <div style={{
            marginTop: 'var(--space-md)',
            padding: 'var(--space-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px'
        }}>
            <div style={{
                fontSize: '0.95rem',
                color: 'var(--accent-aqua)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                marginBottom: 'var(--space-md)'
            }}>
                {chartData.title}
            </div>
            <div style={{ height: '300px', position: 'relative' }}>
                {renderChart()}
            </div>
        </div>
    );
}
