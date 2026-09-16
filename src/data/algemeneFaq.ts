/**
 * De algemene FAQ op de homepage en /over-ons. Eén bron voor de zichtbare
 * vragen (FAQSection) en de FAQPage-structured data, zodat die niet uit elkaar
 * kunnen lopen.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const ALGEMENE_FAQ: FaqItem[] = [
  {
    question: "Wat kost het om een website te laten maken?",
    answer: `Onze pakketten starten vanaf ${PRIJZEN.starter} euro voor een complete starterswebsite. Het Professional pakket start vanaf ${PRIJZEN.professional} euro, met meer pagina's, CMS en SEO basis. Voor maatwerk of webshops maken we een offerte op basis van jouw wensen. Tijdens een vrijblijvend gesprek bespreken we wat het beste past.`
  },
  {
    question: "Hoe lang duurt het voordat mijn website live staat?",
    answer: `Een standaard website staat binnen ${LEVERTIJD.standaard} live, een Starter-website binnen ${LEVERTIJD.starter}. Grotere of complexere projecten duren ${LEVERTIJD.complex}. We werken graag met vaste deadlines en houden je tijdens het proces op de hoogte van de voortgang.`
  },
  {
    question: "Kan ik zelf aanpassingen doen aan mijn website?",
    answer: "Standaard verzorgen wij het volledige beheer van je website, zodat snelheid, veiligheid en stabiliteit gewaarborgd blijven. Wil je toch zelf teksten en afbeeldingen kunnen aanpassen? Op verzoek kunnen wij hiervoor een CMS op maat maken. Voor overige wijzigingen staan we uiteraard altijd voor je klaar."
  },
  {
    question: "Bieden jullie ook onderhoud en support na oplevering?",
    answer: "Absoluut! We bieden verschillende onderhoudspakketten aan, van basis support tot volledig beheer inclusief updates, backups en security monitoring. Ook kun je altijd bij ons terecht voor eenmalige aanpassingen of uitbreidingen van je website."
  },
  {
    question: "Wordt mijn website ook goed gevonden in Google?",
    answer: "Ja, alle websites die wij bouwen zijn standaard SEO-geoptimaliseerd. Dit betekent snelle laadtijden, mobiel responsive design, schone code en juiste meta tags. Voor bedrijven die hoog willen scoren in Google bieden we ook uitgebreide SEO diensten aan zoals keyword research, content optimalisatie en linkbuilding."
  },
  {
    question: "Wat is er nodig om te starten met mijn project?",
    answer: "Om te starten hebben we allereerst een goed gesprek nodig om jouw wensen en doelen te begrijpen. Daarna maken we een offerte en projectplan. Bij akkoord vragen we om content (teksten, afbeeldingen, logo's) en eventueel een aanbetaling. Vervolgens kunnen we direct aan de slag!"
  },
  {
    question: "Leveren jullie ook logo's en huisstijl?",
    answer: "Ja, we bieden complete branding diensten aan. Van logo ontwerp tot complete merkidentiteit inclusief kleurenpalet, typografie, visitekaartjes en andere marketing materialen. Een sterke visuele identiteit is de basis voor online en offline succes."
  },
  {
    question: "Zijn de websites ook geschikt voor mobiele telefoons?",
    answer: "Absoluut! Alle websites die wij maken zijn volledig responsive. Dit betekent dat ze perfect werken en er prachtig uitzien op alle apparaten: desktop, tablet én smartphone. Meer dan 60% van het internetverkeer komt tegenwoordig van mobiele apparaten, dus dit is essentieel."
  }
];;

/** Als vraag/antwoord-paren voor faqPage(). */
export const algemeneFaqParen = () => ALGEMENE_FAQ.map(({ question, answer }) => ({ q: question, a: answer }));import { PRIJZEN, LEVERTIJD } from "@/config/business";

