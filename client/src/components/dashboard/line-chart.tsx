'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"

export type LineChartData = {
    month: string
    challans: number
    grievances?: number
}

export function MonthlyTrendChart({ data }: { data: LineChartData[] }) {
    if (!data.length) {
        return (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No data available
            </div>
        )
    }
    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                    contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                    }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Line
                    type="monotone"
                    dataKey="challans"
                    name="Challans"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
                {data[0]?.grievances !== undefined && (
                    <Line
                        type="monotone"
                        dataKey="grievances"
                        name="Grievances"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    )
}
