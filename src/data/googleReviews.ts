/**
 * Google-reviews van Nieuwblik, overgenomen van het openbare Google-profiel op
 * 9 oktober 2026 (19 reviews, allemaal 5 sterren), nieuwste eerst.
 *
 * Letterlijk, met één bewerking: reviews van vóór de naamswijziging noemen de
 * oude naam Baylab. Die staat hier als "[Nieuwblik]"; de rechte haken laten
 * zien dat het woord is aangepast. Verder niets inkorten of herschrijven: een
 * review hoort te zeggen wat de klant schreef.
 *
 * Nieuwe review op Google? Zet hem bovenaan en werk REVIEWS in
 * src/config/business.ts bij (aantal en score).
 */
export interface GoogleReview {
  naam: string;
  sterren: number;
  tekst: string;
}

export const googleReviews: GoogleReview[] = [
  {
    naam: "Deniz Cem Toptaş",
    sterren: 5,
    tekst: "Het was echt een geweldige ervaring om met Justin samen te werken. Hij is ontzettend goed in zijn werk. Behulpzaam, creatief en een extreem snelle service.",
  },
  {
    naam: "Ebru Yoldas",
    sterren: 5,
    tekst: "Justin heeft mij geweldig geholpen met het bouwen van mijn landingspagina. Hij luistert goed, reageert snel en voert precies uit wat ik voor ogen heb. Daarnaast werkt hij professioneel, denkt enthousiast mee en communiceert prettig. Vanaf het eerste contact was er een fijne klik, wat de samenwerking extra prettig maakte. Ik ben ontzettend blij dat ik Justin heb gevonden en kan hem van harte aanbevelen!",
  },
  {
    naam: "Dennis van Heuven van Staerelingen",
    sterren: 5,
    tekst: "Zeer tevreden over Nieuwblik.com. Reageert snel, denkt goed mee en komt met praktische oplossingen. De communicatie is duidelijk en professioneel, waardoor alles soepel verloopt. Daarnaast hebben ze een mooie, moderne website gemaakt die precies aansluit bij mijn wensen. Betrouwbare partij met goede service. Zeker een aanrader!",
  },
  {
    naam: "Nancy van Ham",
    sterren: 5,
    tekst: "Ik ben heel goed geholpen door Justin van nieuwblik! Het directe contact en de snelle afhandeling van mijn vragen zijn top!!",
  },
  {
    naam: "Danique Kwakman",
    sterren: 5,
    tekst: "Super fijne samenwerking! Er werd echt geluisterd naar mijn wensen en mijn visie is vertaald naar een professionele en mooie website. Goede communicatie, snelle reacties en een resultaat waar ik heel blij mee ben. Mega aanrader!",
  },
  {
    naam: "Jan Groen",
    sterren: 5,
    tekst: "Nieuwblik heeft echt een hele mooie website in elkaar gezet  echt super blij mee bedankt !",
  },
  {
    naam: "Trijntje Laan",
    sterren: 5,
    tekst: "Via mijn collega kwam ik bij Nieuwblik terecht. Vanaf het moment dat ik met Justin in contact kwam, voelde het meteen goed. Justin is enthousiast, denkt goed mee en je merkt meteen dat hij kennis van zaken heeft. Vervolgens is hij aan de slag gegaan om een ontwerp te maken voor mijn website. Het resultaat is prachtig geworden! Professioneel, stijlvol met mijn eigen handschrift. En dat is precies wat ik voor ogen had. Op deze manier wordt mijn passie nog mooier vertaalt. Dank je wel!",
  },
  {
    naam: "Joran",
    sterren: 5,
    tekst: "Goed geholpen!",
  },
  {
    naam: "Jesse Huisman",
    sterren: 5,
    tekst: "[Nieuwblik] is top! Ik heb altijd goed contact gehad met de jongens daar, en hun leveringen zijn snel en betrouwbaar. Ik heb meerdere designs laten maken, van listings tot aan verpakkingen, en elke keer kreeg ik precies wat ik had gevraagd. Ze zijn serieus in wat ze doen, maar maken het proces ook luchtig en plezierig. Absoluut een aanrader voor iedereen die op zoek is naar professionele service en kwaliteit.",
  },
  {
    naam: "Tijs Nieuwboer",
    sterren: 5,
    tekst: "Vanaf het eerste moment dat ik met [Nieuwblik] in contact kwam, was ik onder de indruk van hun professionele aanpak en creatieve inzicht. Ik had een complete rebranding nodig voor mijn bedrijf, inclusief een nieuwe website, huisstijl, en marketingmateriaal. [Nieuwblik]'s team pakte de uitdaging met beide handen aan en overtrof al mijn verwachtingen. Hun vermogen om mijn visie te vertalen naar visueel aantrekkelijke en effectieve ontwerpen was ongeëvenaard. Ze waren altijd bereikbaar voor overleg en hun feedbackproces zorgde ervoor dat we altijd op één lijn zaten. De eindresultaten hebben niet alleen mijn merkidentiteit versterkt, maar ook de interactie met mijn klanten verbeterd. [Nieuwblik] heeft echt een verschil gemaakt en ik ben zeer tevreden met hun werk. Ze hebben een klantgerichte service, leveren op tijd, en garanderen kwaliteit in elk detail. Voor iedereen die zijn bedrijf naar een hoger niveau wil tillen, [Nieuwblik] is de partner die je zoekt",
  },
  {
    naam: "Huub Rood",
    sterren: 5,
    tekst: "Ik kwam bij [Nieuwblik] omdat ik ze via LinkedIn voorbij zag komen. Had een logo nodig voor mij merk dus klopte ik bij ze aan. Ze hadden goede suggesties hoe ik mijn logo beter kon insteken en ook de naam van mijn merk hebben we daardoor aangepast. Hierdoor ben ik makkelijker vindbaar op google en op andere verkoop platformen. Ik kan [Nieuwblik] iedereen aanraden!",
  },
  {
    naam: "Thijs Peerdeman",
    sterren: 5,
    tekst: "Super tevreden met de diensten van [Nieuwblik]. De jongens van [Nieuwblik] denken echt met je mee en zijn pas klaar wanneer jij tevreden bent. Ik raadt ze aan iedereen aan!",
  },
  {
    naam: "Maarten Gesink",
    sterren: 5,
    tekst: "Sinds dag 1 klant bij [Nieuwblik], enorm fijn in contact. Komen professioneel en deskundig over en staan klaar met hun expertise en ideeën. Kortom erg tevreden!",
  },
  {
    naam: "Henk Slok",
    sterren: 5,
    tekst: "Wat een fijn bedrijf fantastisch om met deze jongens te mogen samenwerken het resultaat een prachtige website en sales de begeleiding is heel prettig en je kan altijd terecht aftersales zijn ook zeer professioneel kan het iedereen aanraden",
  },
  {
    naam: "Niels van Esveld",
    sterren: 5,
    tekst: "[Nieuwblik] heeft voor ons bedrijf de website onderhanden genomen, heel fijn en direct contact, handelt snel en luistert niet alleen naar je wens maar neemt ook initiatief.",
  },
  {
    naam: "Ricardo Slok",
    sterren: 5,
    tekst: "Super bedrijf, enorm tevreden met me website. super contact met de jongens dikke 10.",
  },
  {
    naam: "Thom Smit",
    sterren: 5,
    tekst: "Prachtige webpagina gemaakt voor me, erg goed contact. Niets anders dan tevreden",
  },
  {
    naam: "Niels van Muijden",
    sterren: 5,
    tekst: "Veel persoonlijk contact voor, tijdens en na het process. Vriendelijk en betrouwbare mensen met veel inzicht op hun vakgebied!",
  },
  {
    naam: "Stefan Harlaar",
    sterren: 5,
    tekst: "Fijn bedrijf, weten waar ze het over hebben. Altijd bereikbaar en hebben mij voorzien van goed advies!",
  },
];
