import { endOfDay, format, startOfMonth, startOfWeek, startOfYear, subMonths, subWeeks } from "date-fns";

import { duurMinuten, projectNaam, type UrenRegel } from "@/admin/uren";

export interface ExportPeriode {
  sleutel: string;
  label: string;
  van: Date | null;
  tot: Date | null;
}

/** De periodes in het exportmenu, gerekend vanaf vandaag. */
export function exportPeriodes(nu = new Date()): ExportPeriode[] {
  const maandag = startOfWeek(nu, { weekStartsOn: 1 });
  const eersteVanMaand = startOfMonth(nu);
  const morgen = endOfDay(nu);
  return [
    { sleutel: "deze-week", label: "Deze week", van: maandag, tot: morgen },
    { sleutel: "vorige-week", label: "Vorige week", van: subWeeks(maandag, 1), tot: maandag },
    { sleutel: "deze-maand", label: "Deze maand", van: eersteVanMaand, tot: morgen },
    { sleutel: "vorige-maand", label: "Vorige maand", van: subMonths(eersteVanMaand, 1), tot: eersteVanMaand },
    { sleutel: "dit-jaar", label: "Dit jaar", van: startOfYear(nu), tot: morgen },
    { sleutel: "alles", label: "Alles", van: null, tot: null },
  ];
}

/** Uren als getal met twee decimalen en een komma, zoals Excel in het Nederlands verwacht. */
const urenDecimaal = (minuten: number) => (minuten / 60).toFixed(2).replace(".", ",");
const urenKlok = (minuten: number) => `${Math.floor(minuten / 60)}:${`${minuten % 60}`.padStart(2, "0")}`;

/** Eén veld, met aanhalingstekens als er een puntkomma, regeleinde of aanhalingsteken in staat. */
function veld(waarde: string): string {
  return /[;"\r\n]/.test(waarde) ? `"${waarde.replace(/"/g, '""')}"` : waarde;
}

/**
 * De regels als CSV voor Excel en boekhoudprogramma's: puntkomma als
 * scheidingsteken en een komma in de getallen (Nederlandse instellingen),
 * en een BOM vooraan zodat Excel de tekens als UTF-8 leest en "é" geen "Ã©"
 * wordt. Onderaan het totaal en het factureerbare deel.
 */
export function urenNaarCsv(regels: UrenRegel[], naamVan: (userId: string) => string): string {
  const nu = Date.now();
  const kop = ["Datum", "Begin", "Eind", "Uren", "Duur", "Klant", "Project", "Taak", "Omschrijving", "Wie", "Factureerbaar"];
  let totaal = 0;
  let factureerbaar = 0;

  const rijen = regels.map((r) => {
    const minuten = duurMinuten(r, nu);
    totaal += minuten;
    if (r.billable) factureerbaar += minuten;
    const begin = new Date(r.started_at);
    return [
      format(begin, "dd-MM-yyyy"),
      format(begin, "HH:mm"),
      r.ended_at ? format(new Date(r.ended_at), "HH:mm") : "loopt nog",
      urenDecimaal(minuten),
      urenKlok(minuten),
      r.project?.client?.name ?? "",
      r.project ? r.project.name : projectNaam(r),
      r.task?.title ?? "",
      r.description ?? "",
      naamVan(r.user_id),
      r.billable ? "ja" : "nee",
    ];
  });

  const leeg = Array(kop.length).fill("");
  const somRij = (label: string, minuten: number) => {
    const rij = [...leeg];
    rij[0] = label;
    rij[3] = urenDecimaal(minuten);
    rij[4] = urenKlok(minuten);
    return rij;
  };

  return (
    "﻿" +
    [kop, ...rijen, leeg, somRij("Totaal", totaal), somRij("Factureerbaar", factureerbaar)]
      .map((rij) => rij.map((w) => veld(String(w))).join(";"))
      .join("\r\n") +
    "\r\n"
  );
}

/** Laat de browser het bestand opslaan, zonder server ertussen. */
export function downloadBestand(inhoud: string, bestandsnaam: string) {
  const blob = new Blob([inhoud], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = bestandsnaam;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** "Karate School Cor Slok" wordt "karate-school-cor-slok". */
export function slug(tekst: string): string {
  return tekst
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
