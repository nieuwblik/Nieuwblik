/**
 * Regiodata voor Local SEO
 * Bevat alle steden en regio's waar Nieuwblik actief is
 */

export interface Region {
  id: string;
  name: string;
  slug: string;
  province: string;
  type: 'local' | 'major'; // local = directe omgeving, major = grote steden
  description?: string;
  keywords?: string[];
  nearbyPlaces?: string[];
  localInfo?: {
    businessTypes?: string[]; // Type bedrijven in de regio
    specialties?: string[]; // Waar staat de stad om bekend
    population?: string;
    features?: string[]; // Kenmerken van de stad
  };
}

export const regions: Region[] = [
  // Lokale regio's (Noord-Holland / West-Friesland)
  {
    id: 'enkhuizen',
    name: 'Enkhuizen',
    slug: 'enkhuizen',
    province: 'Noord-Holland',
    type: 'local',
    description: 'Historische havenstad in West-Friesland',
    keywords: ['webdesign Enkhuizen', 'website laten maken Enkhuizen', 'webshop Enkhuizen', 'SEO Enkhuizen'],
    nearbyPlaces: ['Bovenkarspel', 'Hoogkarspel', 'Andijk', 'Medemblik'],
    localInfo: {
      businessTypes: ['Horeca & restaurants', 'Jachthavens & watersport', 'Toerisme & attracties', 'Detailhandel', 'Visserij'],
      specialties: ['Historisch centrum', 'Zuiderzeemuseum', 'Havenstad', 'Toeristische trekpleister'],
      population: '18.500',
      features: [
        'Sterke toeristische sector met veel bezoekers',
        'Gezellig historisch centrum met veel winkels',
        'Actieve haven met watersportfaciliteiten',
        'Lokale horeca en restaurants'
      ]
    }
  },
  {
    id: 'hoorn',
    name: 'Hoorn',
    slug: 'hoorn',
    province: 'Noord-Holland',
    type: 'local',
    description: 'Bruisende stad aan het IJsselmeer',
    keywords: ['webdesign Hoorn', 'website laten maken Hoorn', 'webshop Hoorn', 'SEO Hoorn'],
    nearbyPlaces: ['Blokker', 'Zwaag', 'Wognum'],
    localInfo: {
      businessTypes: ['Detailhandel', 'Horeca', 'MKB bedrijven', 'Zakelijke dienstverlening', 'Zorg & welzijn'],
      specialties: ['Historische VOC-stad', 'Levendig stadscentrum', 'Uitgaan & cultuur', 'Winkelstad'],
      population: '73.000',
      features: [
        'Grootste stad van West-Friesland',
        'Breed winkelaanbod in het centrum',
        'Actieve ondernemersvereniging',
        'Diverse horeca en uitgaansgelegenheden'
      ]
    }
  },
  {
    id: 'hoogkarspel',
    name: 'Hoogkarspel',
    slug: 'hoogkarspel',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Hoogkarspel', 'website laten maken Hoogkarspel'],
    nearbyPlaces: ['Enkhuizen', 'Bovenkarspel'],
    localInfo: {
      businessTypes: ['Tuinbouw', 'Agrarische bedrijven', 'Lokale handel', 'Ambachtelijke diensten'],
      specialties: ['Dorpse sfeer', 'Agrarische sector'],
      population: '8.000',
      features: [
        'Hechte gemeenschap met lokale ondernemers',
        'Centraal gelegen tussen Enkhuizen en Hoorn',
        'Actieve dorpsverenigingen'
      ]
    }
  },
  {
    id: 'zwaagdijk',
    name: 'Zwaagdijk',
    slug: 'zwaagdijk',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Zwaagdijk', 'website laten maken Zwaagdijk'],
    nearbyPlaces: ['Hoorn', 'Enkhuizen'],
    localInfo: {
      businessTypes: ['Tuinbouw', 'Lokale ondernemers', 'Ambachten'],
      specialties: ['Tuinbouwgebied', 'Dorpsgemeenschap'],
      population: '1.500',
      features: [
        'Klein dorp met persoonlijke service',
        'Ideaal voor lokale ondernemers',
        'Nabij grotere steden Hoorn en Enkhuizen'
      ]
    }
  },
  {
    id: 'bovenkarspel',
    name: 'Bovenkarspel',
    slug: 'bovenkarspel',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Bovenkarspel', 'website laten maken Bovenkarspel'],
    nearbyPlaces: ['Enkhuizen', 'Hoogkarspel', 'Grootebroek'],
    localInfo: {
      businessTypes: ['Detailhandel', 'Tuinbouw', 'Lokale dienstverlening', 'Horeca'],
      specialties: ['Levendig dorp', 'Goede winkelvoorzieningen'],
      population: '10.000',
      features: [
        'Actief winkelcentrum',
        'Diverse lokale ondernemers',
        'Goed bereikbaar vanuit omliggende dorpen'
      ]
    }
  },
  {
    id: 'venhuizen',
    name: 'Venhuizen',
    slug: 'venhuizen',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Venhuizen', 'website laten maken Venhuizen'],
    nearbyPlaces: ['Enkhuizen', 'Hem', 'Hauwert'],
    localInfo: {
      businessTypes: ['Tuinbouw', 'Agrarisch', 'Lokale handel'],
      specialties: ['Rustig buitengebied', 'Tuinbouwkern'],
      population: '3.500',
      features: [
        'Groene omgeving met tuinbouwbedrijven',
        'Kleine lokale ondernemers',
        'Nabij Enkhuizen'
      ]
    }
  },
  {
    id: 'hem',
    name: 'Hem',
    slug: 'hem',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Hem', 'website laten maken Hem'],
    nearbyPlaces: ['Venhuizen', 'Enkhuizen'],
    localInfo: {
      businessTypes: ['Agrarisch', 'Tuinbouw', 'Lokale diensten'],
      specialties: ['Kleinschalig dorp', 'Landelijke omgeving'],
      population: '2.000',
      features: [
        'Persoonlijke dorpse sfeer',
        'Ideaal voor lokale bedrijven',
        'Nabijheid van Enkhuizen'
      ]
    }
  },
  {
    id: 'hauwert',
    name: 'Hauwert',
    slug: 'hauwert',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Hauwert', 'website laten maken Hauwert'],
    nearbyPlaces: ['Venhuizen', 'Enkhuizen'],
    localInfo: {
      businessTypes: ['Agrarisch', 'Tuinbouw', 'Recreatie'],
      specialties: ['Landelijk gebied', 'Rust en ruimte'],
      population: '800',
      features: [
        'Klein dorp met eigen karakter',
        'Groene omgeving',
        'Dicht bij Enkhuizen'
      ]
    }
  },
  {
    id: 'heerhugowaard',
    name: 'Heerhugowaard',
    slug: 'heerhugowaard',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Heerhugowaard', 'website laten maken Heerhugowaard', 'webshop Heerhugowaard'],
    nearbyPlaces: ['Alkmaar', 'Schagen'],
    localInfo: {
      businessTypes: ['Detailhandel', 'Zakelijke dienstverlening', 'Horeca', 'Gezondheidszorg', 'MKB'],
      specialties: ['Moderne woonstad', 'Winkelcentra', 'Groeiende gemeente'],
      population: '57.000',
      features: [
        'Grote detailhandel met winkelcentra',
        'Veel MKB bedrijven',
        'Goede bereikbaarheid naar Alkmaar en Amsterdam',
        'Jonge, dynamische stad'
      ]
    }
  },
  {
    id: 'schagen',
    name: 'Schagen',
    slug: 'schagen',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Schagen', 'website laten maken Schagen', 'webshop Schagen'],
    nearbyPlaces: ['Heerhugowaard', 'Alkmaar'],
    localInfo: {
      businessTypes: ['Detailhandel', 'Agrarisch', 'Horeca', 'Toerisme', 'MKB'],
      specialties: ['West-Friese marktstad', 'Historisch centrum', 'Bloemenregio'],
      population: '46.000',
      features: [
        'Gezellig winkelcentrum',
        'Bekende bloemenveiling en -handel',
        'Toeristische attracties zoals de West-Friese Markt',
        'Sterke agrarische sector'
      ]
    }
  },
  {
    id: 'andijk',
    name: 'Andijk',
    slug: 'andijk',
    province: 'Noord-Holland',
    type: 'local',
    keywords: ['webdesign Andijk', 'website laten maken Andijk'],
    nearbyPlaces: ['Enkhuizen', 'Medemblik'],
    localInfo: {
      businessTypes: ['Tuinbouw', 'Agrarisch', 'Recreatie', 'Lokale handel'],
      specialties: ['Tuinbouwdorp', 'IJsselmeerkust'],
      population: '6.500',
      features: [
        'Tuinbouwcentrum van de regio',
        'Aan het IJsselmeer gelegen',
        'Toeristische voorzieningen',
        'Actieve lokale ondernemers'
      ]
    }
  },

  // Grote steden (landelijk)
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    slug: 'amsterdam',
    province: 'Noord-Holland',
    type: 'major',
    description: 'Hoofdstad van Nederland',
    keywords: ['webdesign Amsterdam', 'website laten maken Amsterdam', 'webshop Amsterdam', 'SEO Amsterdam'],
    localInfo: {
      businessTypes: ['Tech startups', 'E-commerce', 'Creatieve industrie', 'Horeca', 'Financiële diensten', 'Toerisme'],
      specialties: ['Grootste zakelijke markt', 'Internationale bedrijven', 'Creatieve sector', 'Tech hub'],
      population: '900.000',
      features: [
        'Centrum van Nederlandse economie',
        'Sterke tech en startup scene',
        'Internationale oriëntatie',
        'Grote diversiteit aan sectoren'
      ]
    }
  },
  {
    id: 'rotterdam',
    name: 'Rotterdam',
    slug: 'rotterdam',
    province: 'Zuid-Holland',
    type: 'major',
    description: 'Havenstad met moderne architectuur',
    keywords: ['webdesign Rotterdam', 'website laten maken Rotterdam', 'webshop Rotterdam', 'SEO Rotterdam'],
    localInfo: {
      businessTypes: ['Logistiek & transport', 'Maritieme sector', 'E-commerce', 'Creatieve industrie', 'Bouw'],
      specialties: ['Grootste haven van Europa', 'Moderne architectuur', 'Zakelijke dienstverlening'],
      population: '650.000',
      features: [
        'Internationale havenstad',
        'Sterke logistieke sector',
        'Moderne zakelijke infrastructuur',
        'Dynamische ondernemersstad'
      ]
    }
  },
  {
    id: 'den-haag',
    name: 'Den Haag',
    slug: 'den-haag',
    province: 'Zuid-Holland',
    type: 'major',
    description: 'Hofstad en politiek centrum',
    keywords: ['webdesign Den Haag', 'website laten maken Den Haag', 'webshop Den Haag', 'SEO Den Haag'],
    localInfo: {
      businessTypes: ['Overheid', 'Internationale organisaties', 'Advocatuur', 'Consultancy', 'Horeca'],
      specialties: ['Regeringszetel', 'Internationale rechtspraak', 'Politiek centrum'],
      population: '545.000',
      features: [
        'Zetel van regering en parlement',
        'Internationale organisaties',
        'Juridische sector',
        'Strandtoerisme'
      ]
    }
  },
  {
    id: 'utrecht',
    name: 'Utrecht',
    slug: 'utrecht',
    province: 'Utrecht',
    type: 'major',
    description: 'Historisch centrum van Nederland',
    keywords: ['webdesign Utrecht', 'website laten maken Utrecht', 'webshop Utrecht', 'SEO Utrecht'],
    localInfo: {
      businessTypes: ['Zakelijke dienstverlening', 'ICT', 'Gezondheidszorg', 'Onderwijs', 'Detailhandel'],
      specialties: ['Centraal gelegen', 'Winkelstad', 'Cultureel centrum', 'Knooppunt'],
      population: '360.000',
      features: [
        'Hart van Nederland',
        'Grootste winkelstad',
        'Sterke zakelijke sector',
        'Goede bereikbaarheid'
      ]
    }
  },
  {
    id: 'eindhoven',
    name: 'Eindhoven',
    slug: 'eindhoven',
    province: 'Noord-Brabant',
    type: 'major',
    description: 'Technologie en design hub',
    keywords: ['webdesign Eindhoven', 'website laten maken Eindhoven', 'webshop Eindhoven', 'SEO Eindhoven'],
    localInfo: {
      businessTypes: ['High-tech industrie', 'Design', 'Tech startups', 'Engineering', 'Innovatie'],
      specialties: ['Brainport regio', 'Design hoofdstad', 'Tech innovatie'],
      population: '235.000',
      features: [
        'Technologie en innovatie centrum',
        'Sterke design sector',
        'High-tech campus',
        'Internationale tech bedrijven'
      ]
    }
  },
  {
    id: 'groningen',
    name: 'Groningen',
    slug: 'groningen',
    province: 'Groningen',
    type: 'major',
    description: 'Bruisende studentenstad',
    keywords: ['webdesign Groningen', 'website laten maken Groningen', 'webshop Groningen', 'SEO Groningen'],
    localInfo: {
      businessTypes: ['Onderwijs', 'Horeca', 'Gezondheidszorg', 'Energie', 'Detailhandel'],
      specialties: ['Studentenstad', 'Cultureel leven', 'Noordelijk economisch centrum'],
      population: '235.000',
      features: [
        'Jonge, dynamische bevolking',
        'Levendig uitgaansleven',
        'Sterke universitaire sector',
        'Centrum van Noord-Nederland'
      ]
    }
  },
  {
    id: 'tilburg',
    name: 'Tilburg',
    slug: 'tilburg',
    province: 'Noord-Brabant',
    type: 'major',
    description: 'Stad van cultuur en onderwijs',
    keywords: ['webdesign Tilburg', 'website laten maken Tilburg', 'webshop Tilburg', 'SEO Tilburg'],
    localInfo: {
      businessTypes: ['Onderwijs', 'Cultuur', 'Logistiek', 'MKB', 'Detailhandel'],
      specialties: ['Culturele evenementen', 'Universiteitsstad', 'Centraal in Brabant'],
      population: '220.000',
      features: [
        'Diverse economische sectoren',
        'Sterke culturele sector',
        'Goede logistieke positie',
        'Studentenstad'
      ]
    }
  },
  {
    id: 'almere',
    name: 'Almere',
    slug: 'almere',
    province: 'Flevoland',
    type: 'major',
    description: 'Moderne jonge stad',
    keywords: ['webdesign Almere', 'website laten maken Almere', 'webshop Almere', 'SEO Almere'],
    localInfo: {
      businessTypes: ['Detailhandel', 'Zakelijke dienstverlening', 'Bouw', 'ICT', 'Gezondheidszorg'],
      specialties: ['Snelgroeiende stad', 'Modern wonen', 'Dichtbij Amsterdam'],
      population: '215.000',
      features: [
        'Jonge, groeiende stad',
        'Moderne infrastructuur',
        'Nabij Amsterdam',
        'Diverse economie'
      ]
    }
  },
  {
    id: 'breda',
    name: 'Breda',
    slug: 'breda',
    province: 'Noord-Brabant',
    type: 'major',
    description: 'Parel van het zuiden',
    keywords: ['webdesign Breda', 'website laten maken Breda', 'webshop Breda', 'SEO Breda'],
    localInfo: {
      businessTypes: ['Logistiek', 'Onderwijs', 'Detailhandel', 'Horeca', 'Zakelijke dienstverlening'],
      specialties: ['Historisch centrum', 'Winkelstad', 'Gunstige ligging'],
      population: '185.000',
      features: [
        'Gezellig historisch centrum',
        'Strategische ligging bij België',
        'Sterke detailhandel',
        'Levendig uitgaansleven'
      ]
    }
  },
  {
    id: 'nijmegen',
    name: 'Nijmegen',
    slug: 'nijmegen',
    province: 'Gelderland',
    type: 'major',
    description: 'Oudste stad van Nederland',
    keywords: ['webdesign Nijmegen', 'website laten maken Nijmegen', 'webshop Nijmegen', 'SEO Nijmegen'],
    localInfo: {
      businessTypes: ['Onderwijs', 'Gezondheidszorg', 'Cultuur', 'Horeca', 'Tech'],
      specialties: ['Universitaire stad', 'Historisch', 'Aan de Waal'],
      population: '180.000',
      features: [
        'Oudste stad van Nederland',
        'Sterke universitaire sector',
        'Levendig cultureel leven',
        'Studentenstad'
      ]
    }
  },
  {
    id: 'alkmaar',
    name: 'Alkmaar',
    slug: 'alkmaar',
    province: 'Noord-Holland',
    type: 'major',
    description: 'Kaasstad van Noord-Holland',
    keywords: ['webdesign Alkmaar', 'website laten maken Alkmaar', 'webshop Alkmaar', 'SEO Alkmaar'],
    localInfo: {
      businessTypes: ['Detailhandel', 'Horeca', 'Toerisme', 'Zakelijke dienstverlening', 'Zorg'],
      specialties: ['Kaasmarkt', 'Historisch centrum', 'Winkelstad'],
      population: '110.000',
      features: [
        'Beroemde kaasmarkt',
        'Gezellig winkelcentrum',
        'Toeristische trekpleister',
        'Regionaal centrum'
      ]
    }
  }
];

// Helper functions
export const getRegionBySlug = (slug: string): Region | undefined => {
  console.log('getRegionBySlug called with slug:', slug);
  console.log('Total regions:', regions.length);
  console.log('Available slugs:', regions.map(r => r.slug));
  const found = regions.find(region => region.slug === slug);
  console.log('Found region:', found);
  return found;
};

export const getLocalRegions = (): Region[] => {
  return regions.filter(region => region.type === 'local');
};

export const getMajorRegions = (): Region[] => {
  return regions.filter(region => region.type === 'major');
};

export const getRegionsByProvince = (province: string): Region[] => {
  return regions.filter(region => region.province === province);
};
