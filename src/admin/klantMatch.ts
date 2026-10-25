import { supabase } from "@/integrations/supabase/client";
import { klantSleutel, type MoneybirdContactVolledig } from "@/admin/financien";
import type { Client, TaskWithProject } from "@/admin/queries";

/**
 * Welke klant in het portaal is waarschijnlijk dit Moneybird-contact, ook als
 * de naam niet precies gelijk is? Bedoeld om dubbele klanten te voorkomen:
 * het portaal stelt voor, jij beslist.
 *
 * Signalen, sterkste eerst:
 * - het domein van het e-mailadres is dat van de website ("BeNoted" en
 *   info@benoted.nl), of de websitenaam staat in het e-mailadres
 *   (interieurstudiolaan.nl en Interieurstudiolaan@gmail.com);
 * - de ene naam zit in de andere ("BeNoted" en "BeNoted Media");
 * - de namen delen hun kenmerkende woorden ("Pride Mobility Europe" en
 *   "Pride Mobility Products Europe B.V.");
 * - een naam scheelt één letter en de plaats is gelijk ("Aquatop" en
 *   "Aquastop Witgoed Service", allebei Bovenkarspel).
 */

export interface KlantVoorstel {
  client: Client;
  reden: string;
  /** Hoger is zekerder; 3 is vrijwel zeker. */
  score: number;
}

/** E-maildomeinen waar iedereen op zit; die zeggen niets over het bedrijf. */
const ALGEMEEN = new Set([
  "gmail.com",
  "hotmail.com",
  "hotmail.nl",
  "outlook.com",
  "live.nl",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "ziggo.nl",
  "quicknet.nl",
  "kpnmail.nl",
  "kpnplanet.nl",
  "planet.nl",
  "home.nl",
  "hetnet.nl",
  "xs4all.nl",
  "telfort.nl",
]);

/** Woorden die in veel bedrijfsnamen staan en dus niets onderscheiden. */
const GEWOON = new Set([
  "europe",
  "media",
  "shop",
  "holding",
  "service",
  "services",
  "products",
  "solutions",
  "studio",
  "groep",
  "group",
  "nederland",
  "consultancy",
  "bedrijf",
  "installatie",
  "the",
  "van",
  "der",
  "den",
]);

/** Plaatsen uit de buurt die vaak in bedrijfsnamen staan, ook als de plaats van de klant leeg is. */
const ALGEMENE_PLAATSEN = new Set(["enkhuizen", "hoorn", "bovenkarspel", "grootebroek", "andijk", "venhuizen", "drechterland", "westfriesland"]);

const domeinVan = (url: string | null) => {
  if (!url?.trim()) return null;
  try {
    return new URL(url.includes("://") ? url : `https://${url}`).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
};

const stamVan = (domein: string) => domein.split(".")[0] ?? domein;

const woorden = (naam: string) =>
  naam
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4 && !GEWOON.has(w));

/** Scheelt het hooguit één letter (toevoegen, weglaten of vervangen)? */
function eenLetterVerschil(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

function vergelijk(contact: MoneybirdContactVolledig, client: Client): { reden: string; score: number } | null {
  const mails = (contact.email ?? "")
    .toLowerCase()
    .split(/[,;\s]+/)
    .filter((m) => m.includes("@"));
  const website = domeinVan(client.website);

  if (website) {
    const stam = stamVan(website);
    for (const mail of mails) {
      const domein = mail.split("@")[1] ?? "";
      if (!ALGEMEEN.has(domein) && (domein === website || stamVan(domein) === stam)) {
        return { reden: `E-mailadres ${mail} hoort bij de website ${website}`, score: 3 };
      }
      if (stam.length >= 6 && mail.includes(stam)) {
        return { reden: `De website ${website} staat in het e-mailadres ${mail}`, score: 3 };
      }
    }
  }

  // Omgekeerd: het e-mailadres van de klant tegen dat van het contact.
  const klantMail = client.email?.toLowerCase().split("@")[1];
  if (klantMail && !ALGEMEEN.has(klantMail) && mails.some((m) => m.endsWith(`@${klantMail}`))) {
    return { reden: `Zelfde e-maildomein (${klantMail})`, score: 3 };
  }

  const a = klantSleutel(contact.naam);
  const b = klantSleutel(client.name);
  if (a.length >= 5 && b.length >= 5 && (a.includes(b) || b.includes(a))) {
    return { reden: "De ene naam zit in de andere", score: 2 };
  }

  // Een plaatsnaam in de bedrijfsnaam ("Het Station Enkhuizen") is geen kenmerk.
  const plaatsen = new Set([contact.plaats, client.city].flatMap((p) => (p ? woorden(p) : [])));
  const wa = woorden(contact.naam).filter((w) => !plaatsen.has(w) && !ALGEMENE_PLAATSEN.has(w));
  const wb = woorden(client.name).filter((w) => !plaatsen.has(w) && !ALGEMENE_PLAATSEN.has(w));
  const gedeeld = wa.filter((w) => wb.includes(w));
  if (gedeeld.length >= 2) return { reden: `Namen delen "${gedeeld.join(" ")}"`, score: 2 };

  const zelfdePlaats = Boolean(contact.plaats && client.city && contact.plaats.toLowerCase() === client.city.toLowerCase());
  const bijna = wa.some((x) => x.length >= 6 && wb.some((y) => y.length >= 6 && eenLetterVerschil(x, y)));
  if (bijna && zelfdePlaats) return { reden: `Naam scheelt één letter, allebei in ${contact.plaats}`, score: 2 };
  if (gedeeld.length === 1 && gedeeld[0]!.length >= 6) return { reden: `Namen delen "${gedeeld[0]}"`, score: 1 };
  if (bijna) return { reden: "Naam scheelt één letter", score: 1 };

  return null;
}

/** De beste kandidaat onder de klanten, of null. */
export function waarschijnlijkeKlant(contact: MoneybirdContactVolledig, clients: Client[]): KlantVoorstel | null {
  let beste: KlantVoorstel | null = null;
  for (const client of clients) {
    const uitkomst = vergelijk(contact, client);
    if (uitkomst && (!beste || uitkomst.score > beste.score)) beste = { client, ...uitkomst };
  }
  return beste;
}

/** Het omgekeerde: het meest waarschijnlijke contact bij een klant. */
export function waarschijnlijkContact(
  client: Client,
  contacten: MoneybirdContactVolledig[],
): { contact: MoneybirdContactVolledig; reden: string; score: number } | null {
  let beste: { contact: MoneybirdContactVolledig; reden: string; score: number } | null = null;
  for (const contact of contacten) {
    const uitkomst = vergelijk(contact, client);
    if (uitkomst && (!beste || uitkomst.score > beste.score)) beste = { contact, ...uitkomst };
  }
  return beste;
}

/**
 * Open taken zonder klant en zonder project met deze naam in de titel naar de
 * klant zetten. Zo komen taken die het portaal maakte voordat de klant
 * bestond of gekoppeld was (een offerte factureren) alsnog bij die klant.
 */
export async function koppelLosseTaken(naam: string, clientId: string, tasks: TaskWithProject[]) {
  const zoek = naam.toLowerCase();
  const losse = tasks.filter((t) => !t.project_id && !t.client_id && t.status !== "klaar" && t.title.toLowerCase().includes(zoek));
  if (losse.length === 0) return 0;
  const { error } = await supabase
    .from("tasks")
    .update({ client_id: clientId })
    .in(
      "id",
      losse.map((t) => t.id),
    );
  return error ? 0 : losse.length;
}

/**
 * Groepen Moneybird-contacten die waarschijnlijk hetzelfde bedrijf zijn
 * ("ACHATÉ" en "Achaté B.V.", "Higgsfield" en "Higgsfield Inc."). Met dezelfde
 * signalen als hierboven, maar alleen de zekere (score 2 of hoger), zodat er
 * geen losse gelijkenissen tussen staan.
 */
export function dubbeleContacten(contacten: MoneybirdContactVolledig[]): MoneybirdContactVolledig[][] {
  const ouder = contacten.map((_, i) => i);
  const wortel = (i: number): number => (ouder[i] === i ? i : (ouder[i] = wortel(ouder[i]!)));
  for (let i = 0; i < contacten.length; i += 1) {
    for (let j = i + 1; j < contacten.length; j += 1) {
      const b = contacten[j]!;
      // Het tweede contact als "klant", zodat de vergelijking hierboven bruikbaar is.
      const alsKlant = { name: b.naam, email: b.email, city: b.plaats, website: null } as unknown as Client;
      const uitkomst = vergelijk(contacten[i]!, alsKlant);
      if (uitkomst && uitkomst.score >= 2) ouder[wortel(j)] = wortel(i);
    }
  }
  const groepen = new Map<number, MoneybirdContactVolledig[]>();
  contacten.forEach((c, i) => groepen.set(wortel(i), [...(groepen.get(wortel(i)) ?? []), c]));
  return [...groepen.values()].filter((g) => g.length > 1);
}
