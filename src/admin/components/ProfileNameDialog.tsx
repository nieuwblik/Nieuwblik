import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/admin/AdminAuthContext";
import { adminKeys } from "@/admin/queries";

interface ProfileNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Je eigen naam instellen.
 *
 * Zonder naam valt het portaal terug op je e-mailadres: in de begroeting, op
 * elke taakregel en in de tijdlijn. Het veld bestond al in de database, maar
 * er was nergens een plek om het in te vullen.
 */
const ProfileNameDialog = ({ open, onOpenChange }: ProfileNameDialogProps) => {
  const { user, displayName, refreshProfile } = useAdminAuth();
  const qc = useQueryClient();
  const [naam, setNaam] = useState("");
  const [bezig, setBezig] = useState(false);

  // Bij openen inlezen wat er staat; een e-mailadres laten we leeg, anders
  // sta je je eigen adres te overschrijven met zichzelf.
  useEffect(() => {
    if (!open) return;
    setNaam(displayName.includes("@") ? "" : displayName);
  }, [open, displayName]);

  const opslaan = async () => {
    if (!user) return;
    const schoon = naam.trim();

    setBezig(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: schoon || null })
        .eq("user_id", user.id);
      if (error) throw new Error(error.message);

      await refreshProfile();
      // De namenlijst zit vijf minuten in de cache; zonder dit blijft je oude
      // naam op de taakregels staan.
      await qc.invalidateQueries({ queryKey: adminKeys.team });

      toast.success(schoon ? "Naam bijgewerkt" : "Naam gewist");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Opslaan mislukt");
    } finally {
      setBezig(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Jouw naam</DialogTitle>
          <DialogDescription>
            Zo sta je in de begroeting, op taken die bij je liggen en in de tijdlijn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="profiel-naam" className="text-xs font-normal text-muted-foreground">
            Naam
          </Label>
          <Input
            id="profiel-naam"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void opslaan();
            }}
            placeholder="Justin"
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button onClick={() => void opslaan()} disabled={bezig}>
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileNameDialog;
