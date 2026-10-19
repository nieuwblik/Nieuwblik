import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { briefingSchema, BRIEFING_LIMIET_PER_UUR } from "@/lib/briefing";
import { PRIJZEN, HOSTING_PER_MAAND } from "@/config/business";

// Eenvoudige limiet per serverproces; voorkomt misbruik van de AI-kosten.
const aanvragen = new Map<string, number[]>();

function systeemPrompt() {
  return `Je bent de projectadviseur van Nieuwblik, een webbureau uit Enkhuizen (West-Friesland). Je schrijft in helder Nederlands, in de jij-vorm, zonder em dashes (gebruik komma's of koppeltekens). Gebruik zinnen met alleen een hoofdletter aan het begin.

Maak op basis van de invoer een duidelijke projectbriefing in Markdown met precies deze kopjes (##):
## Samenvatting
## Doelen en doelgroep
## Passende diensten
## Prijsindicatie en planning
## Volgende stap

Noem ALLEEN diensten uit deze lijst, met de link erbij:
- Website laten maken (Starter vanaf €${PRIJZEN.starter}, Professional vanaf €${PRIJZEN.professional}, uitgebreide sites €${PRIJZEN.uitgebreidVan} tot €${PRIJZEN.uitgebreidTot}): /website-laten-maken
- Webshop op maat met Stripe (vanaf €${PRIJZEN.webshopVanaf}): /diensten/webshops
- Taxiwebsite met boekingsformulier (vanaf €${PRIJZEN.taxiWebsiteVanaf}): /taxi-website-laten-maken
- Overstappen van WordPress naar maatwerk: /overstappen-van-wordpress
- Lokale SEO (eenmalig vanaf €750, maandpakketten vanaf €350 per maand, maandelijks opzegbaar): /seo-enkhuizen, /seo-hoorn, /seo-alkmaar, /seo-purmerend
- Hosting met basisonderhoud: €${HOSTING_PER_MAAND},00 per maand excl. btw
- Gratis website-analyse van een bestaande site: /gratis-website-analyse

Een gewone website wordt meestal in 10 tot 14 werkdagen opgeleverd. Prijzen zijn vaste prijzen excl. btw. Verzin geen andere diensten, prijzen, kortingen of garanties. Houd het compact (maximaal ongeveer 350 woorden). Eindig bij "Volgende stap" met het advies de briefing naar Nieuwblik te sturen of via WhatsApp te bespreken.`;
}

export const Route = createFileRoute("/api/briefing")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
        }
        const parsed = briefingSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: parsed.error.issues[0]?.message ?? "Controleer je invoer." }, { status: 400 });
        }

        const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "onbekend";
        const nu = Date.now();
        const recent = (aanvragen.get(ip) ?? []).filter((t) => nu - t < 3600_000);
        if (recent.length >= BRIEFING_LIMIET_PER_UUR) {
          return Response.json({ error: "Je hebt het maximum aantal briefings voor dit uur bereikt. Probeer het later opnieuw." }, { status: 429 });
        }
        recent.push(nu);
        aanvragen.set(ip, recent);

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "De briefingtool is tijdelijk niet beschikbaar." }, { status: 500 });

        const d = parsed.data;
        const invoer = [
          `Bedrijf en branche: ${d.bedrijf}`,
          d.plaats && `Plaats: ${d.plaats}`,
          `Doelen: ${d.doelen}`,
          d.huidigeSite && `Huidige website: ${d.huidigeSite}`,
          d.functies && `Gewenste functies: ${d.functies}`,
          d.budget && `Budgetindicatie: ${d.budget}`,
          d.start && `Gewenste start: ${d.start}`,
        ].filter(Boolean).join("\n");

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });

        // Fouten van de gateway (402/429/403) vóór het streamen opvangen.
        let foutStatus = 0;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: systeemPrompt(),
          messages: [{ role: "user", content: invoer }],
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              store: false,
            },
          },
          onError: ({ error }) => {
            const s = (error as { statusCode?: number })?.statusCode;
            foutStatus = typeof s === "number" ? s : 500;
            console.error("briefing fout", s);
          },
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const deel of result.textStream) controller.enqueue(encoder.encode(deel));
              if (foutStatus) {
                const melding =
                  foutStatus === 429
                    ? "Het is even druk. Probeer het over een minuut opnieuw."
                    : foutStatus === 402 || foutStatus === 403
                      ? "De briefingtool is tijdelijk niet beschikbaar. Neem gerust direct contact op."
                      : "Er ging iets mis bij het maken van je briefing. Probeer het later opnieuw.";
                controller.enqueue(encoder.encode(`\n\n[[FOUT]]${melding}`));
              }
            } catch {
              controller.enqueue(encoder.encode("\n\n[[FOUT]]Er ging iets mis bij het maken van je briefing."));
            }
            controller.close();
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});
