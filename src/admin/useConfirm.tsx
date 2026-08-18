import { useCallback, useRef, useState, type ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Vraag {
  titel: string;
  beschrijving?: ReactNode;
  /** Standaard "Verwijderen"; zet iets anders bij een niet-wissende actie. */
  bevestigLabel?: string;
}

/**
 * Bevestiging vragen zonder window.confirm.
 *
 * De ingebouwde browserdialoog wordt in ingesloten weergaven onderdrukt: hij
 * geeft dan meteen "nee" terug zonder iets te tonen, waardoor elke
 * verwijderknop stil niets deed. Deze variant is gewoon onderdeel van de
 * pagina en werkt dus overal — en ziet er bovendien uit als de rest.
 *
 * Gebruik:
 *   const { vraagBevestiging, dialoog } = useConfirm();
 *   if (!(await vraagBevestiging({ titel: "Weet je het zeker?" }))) return;
 *   ...en render {dialoog} ergens in de component.
 */
export function useConfirm() {
  const [vraag, setVraag] = useState<Vraag | null>(null);
  const antwoord = useRef<((ja: boolean) => void) | null>(null);

  const vraagBevestiging = useCallback(
    (nieuwe: Vraag) =>
      new Promise<boolean>((resolve) => {
        // Een openstaande vraag die wordt overschreven zou anders blijven
        // hangen; die beantwoorden we alsnog met "nee".
        antwoord.current?.(false);
        antwoord.current = resolve;
        setVraag(nieuwe);
      }),
    [],
  );

  const sluit = (ja: boolean) => {
    antwoord.current?.(ja);
    antwoord.current = null;
    setVraag(null);
  };

  const dialoog = (
    <AlertDialog open={vraag !== null} onOpenChange={(open) => !open && sluit(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{vraag?.titel}</AlertDialogTitle>
          {vraag?.beschrijving && <AlertDialogDescription>{vraag.beschrijving}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => sluit(false)}>Annuleren</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => sluit(true)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {vraag?.bevestigLabel ?? "Verwijderen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { vraagBevestiging, dialoog };
}
