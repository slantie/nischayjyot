'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts"

export type BarChartData = {
    name: string
    value: number
    color?: string
}

export function SimpleBarChart({
    data,
    color = "hsl(var(--primary))",
}: {
    data: BarChartData[]
    color?: string
}) {
    if (!data.length) {
        return (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No data available
            </div>
        )
    }
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                    }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color ?? color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
