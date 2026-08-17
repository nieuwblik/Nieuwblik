/**
 * Foto's naar WebP omzetten in de browser, vóór het uploaden.
 *
 * De instellingen zijn bewust mild. Bij taken gaat het vaak om screenshots
 * met tekst erin, en juist daar valt agressieve compressie meteen op: letters
 * krijgen vieze randen en dunne lijnen verdwijnen. Liever een bestand dat wat
 * groter is dan een screenshot die je moet ontcijferen.
 */

/** Hoog genoeg om tekst in screenshots scherp te houden. */
const QUALITY = 0.92;

/**
 * Alleen verkleinen bij extreem grote afbeeldingen. Een schermafdruk van een
 * 5K-monitor is zinloos groot; alles daaronder blijft op ware grootte, want
 * terugschalen is precies wat leesbaarheid kost.
 */
const MAX_EDGE = 3200;

export interface ConvertedImage {
  blob: Blob;
  /** Bestandsnaam met de .webp-extensie. */
  name: string;
  width: number;
  height: number;
}

export function isSupportedImage(file: File): boolean {
  return file.type.startsWith("image/");
}

function withWebpExtension(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base || "afbeelding"}.webp`;
}

/**
 * Zet een afbeelding om naar WebP. Gooit een fout als het bestand niet als
 * afbeelding te lezen is, zodat de aanroeper dat kan melden in plaats van een
 * leeg bestand te uploaden.
 */
export async function toWebp(file: File): Promise<ConvertedImage> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error(`"${file.name}" kon niet als afbeelding gelezen worden`);
  });

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("De browser kon geen canvas maken om de afbeelding om te zetten");
  }

  // Vlakke witte ondergrond: WebP kan transparantie aan, maar een PNG met
  // doorzichtige achtergrond wordt anders zwart zodra hij op een lichte kaart
  // getoond wordt.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );

  if (!blob) throw new Error("Omzetten naar WebP is mislukt");

  return { blob, name: withWebpExtension(file.name), width, height };
}
