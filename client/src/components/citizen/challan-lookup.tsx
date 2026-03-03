"use client";

import { useState, type FormEvent } from "react";
import {
  Search,
  Loader2,
  X,
  Car,
  MapPin,
  Calendar,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getChallanByNumber } from "@/actions/challans";

const VIOLATION_LABELS: Record<string, string> = {
  red_light: "Red Light Jumping",
  overspeeding: "Overspeeding",
  no_helmet: "No Helmet",
  no_seatbelt: "No Seatbelt",
  pillion_overload: "Pillion Overload",
  wrong_lane: "Wrong Lane",
  parking_violation: "Parking Violation",
  signal_violation: "Signal Violation",
  document_violation: "Document Violation",
  other: "Other",
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: "border-green-200 bg-green-50 text-green-700",
  unpaid: "border-red-200 bg-red-50 text-red-700",
  disputed: "border-yellow-200 bg-yellow-50 text-yellow-700",
  waived: "border-gray-200 bg-gray-50 text-gray-600",
};

type ChallanResult = {
  id: string;
  challan_number: string;
  vehicle_number: string;
  violation_type: string;
  violation_place: string;
  city: string;
  challan_date: string;
  fine_amount: number;
  payment_status: string;
  owner_name: string | null;
};

export function ChallanLookupWidget() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ChallanResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setResult(null);
    setNotFound(false);

    const res = await getChallanByNumber(trimmed);
    setIsLoading(false);

    if (res.error || !res.data) {
      setNotFound(true);
    } else {
      setResult(res.data as unknown as ChallanResult);
    }
  }

  function handleClear() {
    setQuery("");
    setResult(null);
    setNotFound(false);
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8">
          <Search className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">Challan Lookup</p>
          <p className="text-xs text-muted-foreground">
            Verify any challan by number
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter challan number…"
            className="font-mono text-sm pr-8"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              name="Clear"
              title="Clear search"
              aria-label="Clear search"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!query.trim() || isLoading}
          className="gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
          Look up
        </Button>
      </form>

      {/* Result */}
      {result && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                Challan #
              </p>
              <p className="font-semibold">{result.challan_number}</p>
            </div>
            <Badge
              className={`text-xs ${PAYMENT_COLORS[result.payment_status] ?? ""}`}
            >
              {result.payment_status.charAt(0).toUpperCase() +
                result.payment_status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Car className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono font-medium text-foreground">
                {result.vehicle_number}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>
                {new Date(result.challan_date).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {result.violation_place}, {result.city}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md bg-background border px-3 py-2">
            <span className="text-sm text-muted-foreground">
              {VIOLATION_LABELS[result.violation_type] ?? result.violation_type}
            </span>
            <span className="flex items-center gap-0.5 font-semibold text-sm">
              <IndianRupee className="h-3.5 w-3.5" />
              {Number(result.fine_amount).toLocaleString("en-IN")}
            </span>
          </div>

          {result.payment_status === "unpaid" && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              This challan has an outstanding fine. Pay to avoid further action.
            </div>
          )}
          {result.payment_status === "paid" && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Payment received. This challan is cleared.
            </div>
          )}
        </div>
      )}

      {notFound && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0" />
          No challan found with that number. Check the number and try again.
        </div>
      )}
    </div>
  );
}
