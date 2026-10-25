import { toast } from "sonner";

import type { ContactAanmakenResultaat } from "@/admin/financien";

/** De melding na het aanmaken of koppelen van een klant in Moneybird. */
export function meldMoneybird(r: Extract<ContactAanmakenResultaat, { ok: true }>, naam: string) {
  const openen = { label: "Openen", onClick: () => window.open(r.contact.url, "_blank", "noopener") };
  if (r.soort === "aangemaakt") toast.success(`${naam} staat nu ook in Moneybird`, { action: openen });
  else if (r.soort === "gekoppeld") toast.success(`${naam} gekoppeld aan ${r.contact.naam} in Moneybird`, { action: openen });
  else toast(`${naam} was al gekoppeld aan ${r.contact.naam}`, { action: openen });
}
