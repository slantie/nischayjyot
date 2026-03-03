import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { FAQ } from "@/lib/supabase/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "FAQ" };

export default async function FAQPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .eq("language", "en")
    .order("display_order", { ascending: true });

  const faqs = (data ?? []) as FAQ[];

  const grouped = faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
    const cat = faq.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Common questions about ONOC, NishchayJyot, and the grievance process.
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {items.length}
            </Badge>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {items.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-lg bg-card px-4"
              >
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}

      {faqs.length === 0 && (
        <p className="text-sm text-muted-foreground">No FAQs available yet.</p>
      )}
    </div>
  );
}
