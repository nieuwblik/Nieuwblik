import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, LogOut, Check, X } from "lucide-react";

interface Review {
  id: string;
  name: string;
  email: string;
  company: string | null;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchReviews();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/admin/login');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      toast.error("Geen toegang");
      navigate('/admin/login');
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      toast.error("Fout bij laden van reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Review goedgekeurd");
      fetchReviews();
    } catch (error) {
      toast.error("Fout bij goedkeuren");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Review verwijderd");
      fetchReviews();
    } catch (error) {
      toast.error("Fout bij verwijderen");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Beheer klantbeoordelingen</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              {reviews.filter(r => !r.is_approved).length} reviews wachten op goedkeuring
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Laden...</p>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground">Geen reviews gevonden</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Bedrijf</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.name}</TableCell>
                      <TableCell>{review.company || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{review.review_text}</TableCell>
                      <TableCell>
                        {review.is_approved ? (
                          <Badge variant="default">Goedgekeurd</Badge>
                        ) : (
                          <Badge variant="secondary">In afwachting</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(review.created_at).toLocaleDateString('nl-NL')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!review.is_approved && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(review.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(review.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
