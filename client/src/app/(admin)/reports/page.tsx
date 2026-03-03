import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import {
  VIOLATION_TYPE_LABELS,
  GRIEVANCE_CATEGORY_LABELS,
  GUJARAT_PILOT_CITIES,
} from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coins,
  Car,
  FileText,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Download,
  MapPin,
} from "lucide-react";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { SimpleBarChart } from "@/components/dashboard/bar-chart";
import { MonthlyTrendChart } from "@/components/dashboard/line-chart";
import Link from "next/link";
import type {
  Challan,
  Grievance,
  ViolationType,
  GrievanceCategory,
} from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Reports" };

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#84cc16",
];

function getMonth(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
}

export default async function ReportsPage() {
  const admin = createAdminClient();

  const [{ data: rawChallans }, { data: rawGrievances }] = await Promise.all([
    admin
      .from("challans")
      .select(
        "violation_type, payment_status, fine_amount, city, vehicle_class, offender_gender, offender_age_group, number_plate_type, challan_date",
      ),
    admin.from("grievances").select("category, status, created_at"),
  ]);

  type ChallanRow = Pick<
    Challan,
    | "violation_type"
    | "payment_status"
    | "fine_amount"
    | "city"
    | "vehicle_class"
    | "offender_gender"
    | "offender_age_group"
    | "number_plate_type"
    | "challan_date"
  >;
  type GrievanceRow = Pick<Grievance, "category" | "status" | "created_at">;

  const challans = (rawChallans ?? []) as unknown as ChallanRow[];
  const grievances = (rawGrievances ?? []) as unknown as GrievanceRow[];

  // KPI values
  const totalRevenue = challans
    .filter((c) => c.payment_status === "paid")
    .reduce((s, c) => s + Number(c.fine_amount), 0);
  const totalPending = challans
    .filter((c) => c.payment_status === "unpaid")
    .reduce((s, c) => s + Number(c.fine_amount), 0);

  // Violation type bar
  const violationCounts = challans.reduce<Record<string, number>>((acc, c) => {
    acc[c.violation_type] = (acc[c.violation_type] ?? 0) + 1;
    return acc;
  }, {});
  const violationBarData = Object.entries(violationCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([vt, count], i) => ({
      name: VIOLATION_TYPE_LABELS[vt as ViolationType] ?? vt,
      value: count,
      color: COLORS[i % COLORS.length],
    }));

  // Payment status donut
  const paymentCounts = challans.reduce<Record<string, number>>((acc, c) => {
    acc[c.payment_status] = (acc[c.payment_status] ?? 0) + 1;
    return acc;
  }, {});
  const paymentDonut = [
    { name: "Paid", value: paymentCounts["paid"] ?? 0, color: "#22c55e" },
    { name: "Unpaid", value: paymentCounts["unpaid"] ?? 0, color: "#ef4444" },
    {
      name: "Disputed",
      value: paymentCounts["disputed"] ?? 0,
      color: "#eab308",
    },
    { name: "Waived", value: paymentCounts["waived"] ?? 0, color: "#94a3b8" },
  ].filter((d) => d.value > 0);

  // Vehicle class donut
  const vehicleCounts = challans.reduce<Record<string, number>>((acc, c) => {
    const vc = (c.vehicle_class as string) ?? "other";
    acc[vc] = (acc[vc] ?? 0) + 1;
    return acc;
  }, {});
  const vehicleDonut = [
    {
      name: "Two Wheeler",
      value: vehicleCounts["two_wheeler"] ?? 0,
      color: "#3b82f6",
    },
    {
      name: "Four Wheeler",
      value: vehicleCounts["four_wheeler"] ?? 0,
      color: "#a855f7",
    },
    {
      name: "Commercial",
      value: vehicleCounts["commercial"] ?? 0,
      color: "#f97316",
    },
    { name: "Other", value: vehicleCounts["other"] ?? 0, color: "#94a3b8" },
  ].filter((d) => d.value > 0);

  // Gender donut
  const genderCounts = challans.reduce<Record<string, number>>((acc, c) => {
    const g = (c.offender_gender as string) ?? "other";
    acc[g] = (acc[g] ?? 0) + 1;
    return acc;
  }, {});
  const genderDonut = [
    { name: "Male", value: genderCounts["male"] ?? 0, color: "#3b82f6" },
    { name: "Female", value: genderCounts["female"] ?? 0, color: "#ec4899" },
    { name: "Other", value: genderCounts["other"] ?? 0, color: "#94a3b8" },
  ].filter((d) => d.value > 0);

  // Age group donut
  const ageCounts = challans.reduce<Record<string, number>>((acc, c) => {
    const ag = (c.offender_age_group as string) ?? "other";
    acc[ag] = (acc[ag] ?? 0) + 1;
    return acc;
  }, {});
  const ageDonut = [
    { name: "Below 18", value: ageCounts["below_18"] ?? 0, color: "#f97316" },
    { name: "18–30", value: ageCounts["18_30"] ?? 0, color: "#3b82f6" },
    { name: "30–45", value: ageCounts["30_45"] ?? 0, color: "#22c55e" },
    { name: "Above 45", value: ageCounts["above_45"] ?? 0, color: "#a855f7" },
  ].filter((d) => d.value > 0);

  // Number plate type donut
  const npCounts = challans.reduce<Record<string, number>>((acc, c) => {
    const np = (c.number_plate_type as string) ?? "standard";
    acc[np] = (acc[np] ?? 0) + 1;
    return acc;
  }, {});
  const npDonut = [
    { name: "Standard", value: npCounts["standard"] ?? 0, color: "#22c55e" },
    {
      name: "Non-Standard",
      value: npCounts["non_standard"] ?? 0,
      color: "#ef4444",
    },
  ].filter((d) => d.value > 0);

  // Grievance category pie
  const catCounts = grievances.reduce<Record<string, number>>((acc, g) => {
    acc[g.category] = (acc[g.category] ?? 0) + 1;
    return acc;
  }, {});
  const catDonut = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count], i) => ({
      name: GRIEVANCE_CATEGORY_LABELS[cat as GrievanceCategory] ?? cat,
      value: count,
      color: COLORS[i % COLORS.length],
    }));

  // Monthly trend
  const challansByMonth = challans.reduce<Record<string, number>>((acc, c) => {
    const m = getMonth(c.challan_date);
    acc[m] = (acc[m] ?? 0) + 1;
    return acc;
  }, {});
  const grievancesByMonth = grievances.reduce<Record<string, number>>(
    (acc, g) => {
      const m = getMonth(g.created_at);
      acc[m] = (acc[m] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const allMonths = Array.from(
    new Set([
      ...Object.keys(challansByMonth),
      ...Object.keys(grievancesByMonth),
    ]),
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const trendData = allMonths.slice(-12).map((m) => ({
    month: m,
    challans: challansByMonth[m] ?? 0,
    grievances: grievancesByMonth[m] ?? 0,
  }));

  // City bar
  const cityBarData = GUJARAT_PILOT_CITIES.map((city, i) => ({
    name: city,
    value: challans.filter((c) => c.city === city).length,
    color: COLORS[i % COLORS.length],
  }));

  // Frequent complaints hotspot — top city × violation combos
  type HotspotKey = `${string}|${string}`;
  const hotspotMap = challans.reduce<Record<HotspotKey, number>>((acc, c) => {
    const key: HotspotKey = `${c.city}|${c.violation_type}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const hotspots = Object.entries(hotspotMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => {
      const [city, vt] = key.split("|");
      return {
        city,
        violation: VIOLATION_TYPE_LABELS[vt as ViolationType] ?? vt,
        count,
        pct:
          challans.length > 0 ? Math.round((count / challans.length) * 100) : 0,
      };
    });

  // Grievance resolution rate by category
  const resolutionMap = grievances.reduce<
    Record<string, { total: number; resolved: number }>
  >((acc, g) => {
    if (!acc[g.category]) acc[g.category] = { total: 0, resolved: 0 };
    acc[g.category].total++;
    if (g.status === "resolved") acc[g.category].resolved++;
    return acc;
  }, {});
  const resolutionStats = Object.entries(resolutionMap)
    .map(([cat, { total, resolved }]) => ({
      category: GRIEVANCE_CATEGORY_LABELS[cat as GrievanceCategory] ?? cat,
      total,
      resolved,
      rate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comprehensive data insights for the ONOC Gujarat pilot
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-1.5 shrink-0"
        >
          <Link href="/manage-grievances/export">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Link>
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Revenue Collected",
            value: formatCurrency(totalRevenue),
            icon: Coins,
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-950/30",
          },
          {
            label: "Pending Revenue",
            value: formatCurrency(totalPending),
            icon: Coins,
            color: "text-red-600",
            bg: "bg-red-50 dark:bg-red-950/30",
          },
          {
            label: "Total Challans",
            value: challans.length.toLocaleString(),
            icon: Car,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950/30",
          },
          {
            label: "Total Grievances",
            value: grievances.length.toLocaleString(),
            icon: FileText,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-950/30",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Monthly Trend —
            Challans & Grievances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyTrendChart data={trendData} />
        </CardContent>
      </Card>

      {/* Violation Types Bar + City Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Violation Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={violationBarData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" /> Challans by City
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={cityBarData} />
          </CardContent>
        </Card>
      </div>

      {/* Donut Charts Grid */}
      <div>
        <h2 className="mb-4 text-base font-semibold">Challan Distribution</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart data={paymentDonut} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Vehicle Class
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart data={vehicleDonut} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart data={genderDonut} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Age Group
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart data={ageDonut} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Number Plate Type
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart data={npDonut} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm text-muted-foreground">
                Grievance Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <DonutChart data={catDonut} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Frequent Complaint Hotspots
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top city × violation combos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                Top Violation Hotspots by City
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hotspots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No data available
                </p>
              ) : (
                hotspots.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="truncate text-sm font-medium">
                          {h.city} — {h.violation}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {h.count} challans
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${h.pct}%` }}
                        />
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs ${h.pct >= 5 ? "border-red-200 text-red-600" : "border-amber-200 text-amber-600"}`}
                    >
                      {h.pct}%
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Grievance resolution rate by category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                Grievance Resolution Rate by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resolutionStats.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No data available
                </p>
              ) : (
                resolutionStats.map((r) => (
                  <div key={r.category}>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-medium">{r.category}</p>
                      <span className="text-xs text-muted-foreground">
                        {r.resolved}/{r.total} resolved
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${r.rate >= 70 ? "bg-green-500" : r.rate >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${r.rate}%` }}
                        />
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold ${r.rate >= 70 ? "text-green-600" : r.rate >= 40 ? "text-amber-600" : "text-red-600"}`}
                      >
                        {r.rate}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
