'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

export type DonutChartData = {
    name: string
    value: number
    color: string
}

export function DonutChart({ data, title }: { data: DonutChartData[]; title?: string }) {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    if (total === 0) {
        return (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No data available
            </div>
        )
    }
    return (
        <div className="w-full">
            {title && <p className="mb-2 text-sm font-medium text-center text-muted-foreground">{title}</p>}
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) =>
                            value != null
                                ? [`${value} (${((Number(value) / total) * 100).toFixed(1)}%)`, ""]
                                : ["", ""]
                        }
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span className="text-xs">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
