'use client'

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {OptionWithStats} from "@/types";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function PollResults({ options }: { options: OptionWithStats[] }) {
    return (
        <div className="space-y-4">
            <div className="h-64">
                <Bar
                    data={{
                        labels: options.map(o => o.text),
                        datasets: [
                            {
                                label: 'Votes',
                                data: options.map(o => o.vote_count),
                                backgroundColor: 'hsl(24.6, 95%, 53.1%)',
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const option = options[context.dataIndex];
                                        return `${option.text}: ${option.vote_count} votes (${option.percentage}%)`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    precision: 0
                                }
                            }
                        }
                    }}
                />
            </div>
            <div className="grid gap-2">
                {options.map(option => (
                    <div key={option.id} className="flex items-center justify-between">
                        <span>{option.text}</span>
                        <span className="font-medium">{option.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}