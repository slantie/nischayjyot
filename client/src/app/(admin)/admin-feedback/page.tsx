import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFeedbackForAdmin } from "@/actions/feedback";
import { formatDateTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Star,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = { title: "Citizen Feedback" };

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
        ) : (
          <Star key={i} className="h-3.5 w-3.5 text-muted-foreground/30" />
        ),
      )}
    </div>
  );
}

type FeedbackRow = {
  id: string;
  satisfaction_rating: number | null;
  difficulties_faced: string | null;
  suggestions: string | null;
  created_at: string;
  profiles: { full_name: string; phone: string } | null;
  grievances: { ticket_number: number } | null;
};

export default async function AdminFeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await getFeedbackForAdmin();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  const feedbackRows = (data ?? []) as unknown as FeedbackRow[];
  const avgRating = feedbackRows.length
    ? feedbackRows.reduce((sum, f) => sum + (f.satisfaction_rating ?? 0), 0) /
    feedbackRows.filter((f) => f.satisfaction_rating).length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Citizen Feedback
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {feedbackRows.length} submissions
            {avgRating > 0 && ` · Avg rating: ${avgRating.toFixed(1)} / 5`}
          </p>
        </div>
      </div>

      {feedbackRows.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No feedback yet"
          description="Citizen feedback submissions will appear here once they start using the portal."
        />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Citizen</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Grievance</TableHead>
                <TableHead>Difficulties</TableHead>
                <TableHead>Suggestions</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackRows.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>
                    <p className="font-medium text-sm">
                      {f.profiles?.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {f.profiles?.phone}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={f.satisfaction_rating} />
                  </TableCell>
                  <TableCell>
                    {f.grievances ? (
                      <Badge variant="outline" className="text-xs font-mono">
                        #{f.grievances.ticket_number}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        General
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-50">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {f.difficulties_faced ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-50">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {f.suggestions ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(f.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
