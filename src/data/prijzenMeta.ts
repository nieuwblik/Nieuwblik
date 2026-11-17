import { LEVERTIJD, PRIJZEN, euroTeken } from "@/config/business";

/*
 * Titel en beschrijving van /prijzen, los van de pagina. De route leest ze voor
 * head(); stonden ze in de pagina zelf, dan trok die import de hele pagina
 * (met de pakketten en framer-motion) in de hoofdbundel van elke pagina.
 */
export const PRIJZEN_TITEL = `Prijzen website laten maken | Vanaf ${euroTeken(PRIJZEN.starter)} - Nieuwblik`;
export const PRIJZEN_OMSCHRIJVING = `Prijzen van Nieuwblik: Starter ${euroTeken(PRIJZEN.starter)}, Professional vanaf ${euroTeken(PRIJZEN.professional)} of maatwerk op aanvraag. Vaste prijs vooraf, levertijd vanaf ${LEVERTIJD.starter}.`;
