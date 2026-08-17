import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/admin/components/EmptyState";
import { formatDate } from "@/admin/format";
import { adminKeys } from "@/admin/queries";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Review = Tables<"reviews">;

const Reviews = () => {
  const qc = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: adminKeys.reviews,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const approve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Review goedgekeurd");
      void qc.invalidateQueries({ queryKey: adminKeys.reviews });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Review verwijderd");
      void qc.invalidateQueries({ queryKey: adminKeys.reviews });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const pending = reviews.filter((r) => !r.is_approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alleen goedgekeurde reviews verschijnen op de website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Binnengekomen beoordelingen</CardTitle>
          <CardDescription>
            {pending === 0 ? "Alles is beoordeeld." : `${pending} ${pending === 1 ? "review wacht" : "reviews wachten"} op goedkeuring.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Reviews laden…</p>
          ) : reviews.length === 0 ? (
            <EmptyState icon={Star} title="Nog geen reviews" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead className="hidden md:table-cell">Bedrijf</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="max-w-xs">Review</TableHead>
                    <TableHead className="hidden lg:table-cell">Datum</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} className={review.is_approved ? undefined : "bg-amber-50/50"}>
                      <TableCell className="font-medium">{review.name}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {review.company || "—"}
                      </TableCell>
                      <TableCell>
                        <span className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="line-clamp-2 text-sm text-muted-foreground">{review.review_text}</span>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {formatDate(review.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {!review.is_approved && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => approve.mutate(review.id)}
                              aria-label="Goedkeuren"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (window.confirm(`Review van ${review.name} verwijderen?`)) remove.mutate(review.id);
                            }}
                            aria-label="Verwijderen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
