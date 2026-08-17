-- ===========================================
-- SEED: portfolio -> portaal
--
-- Zet de bestaande portfolio-cases uit src/data/projects.ts in het portaal,
-- zodat er meteen mee gewerkt kan worden. Elke case wordt één klant met één
-- project met status 'live'.
--
-- Idempotent: portfolio_slug is uniek, dus opnieuw draaien werkt de bestaande
-- rijen bij in plaats van ze te dupliceren. Handmatig aangepaste statussen,
-- deadlines en budgetten blijven staan — die worden hier niet overschreven.
-- ===========================================

DO $seed$
DECLARE
  v_client_id UUID;
  v_project_id UUID;
  v_created BOOLEAN;
BEGIN

  -- Taxi Drechterland
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Taxi Drechterland' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Taxi Drechterland', 'https://taxidrechterland.nl', 'actief', 'Taxi & Personenvervoer')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'taxi-drechterland' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Taxi Drechterland', 'Een snelle taxiwebsite voor Hoogkarspel en omstreken, met een boekingsformulier dat de ritwens van de klant direct omzet in een kant-en-klaar WhatsApp-bericht voor de chauffeur.', 'live', 'https://taxidrechterland.nl', 'taxi-drechterland')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2026.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://taxidrechterland.nl')
     WHERE id = v_project_id;
  END IF;

  -- Feigro Dakwerken
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Feigro Dakwerken' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Feigro Dakwerken', 'https://feigro.nl', 'actief', 'Dakdekkersdiensten')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'feigro-dakwerken' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Feigro Dakwerken', 'Een krachtige merkwebsite voor dakdekkersbedrijf Feigro, met een directe lekkage-melder naast het reguliere offertetraject.', 'live', 'https://feigro.nl', 'feigro-dakwerken')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2026.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://feigro.nl')
     WHERE id = v_project_id;
  END IF;

  -- Een Bundel Geluk
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Een Bundel Geluk' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Een Bundel Geluk', 'https://www.eenbundelgeluk.nl', 'actief', 'E-commerce, Gezondheid & Persoonlijke Branding')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'een-bundel-geluk' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Een Bundel Geluk', 'Een sfeervolle webshop en merkwebsite voor handgemaakte natuurlijke huidverzorging en kruidenthee uit Enkhuizen.', 'live', 'https://www.eenbundelgeluk.nl', 'een-bundel-geluk')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2026.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://www.eenbundelgeluk.nl')
     WHERE id = v_project_id;
  END IF;

  -- Aardingsbedrijf West-Friesland
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Aardingsbedrijf West-Friesland' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Aardingsbedrijf West-Friesland', 'https://www.aardingsbedrijfwestfriesland.nl', 'actief', 'Zakelijke website, Leadgeneratie, Techniek & Installatie')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'aardingsbedrijf-west-friesland' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Aardingsbedrijf West-Friesland', 'Een conversiegerichte website voor specialistische aardingsdiensten met sterke lokale zichtbaarheid in West-Friesland.', 'live', 'https://www.aardingsbedrijfwestfriesland.nl', 'aardingsbedrijf-west-friesland')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2026.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://www.aardingsbedrijfwestfriesland.nl')
     WHERE id = v_project_id;
  END IF;

  -- Quantum Rehab Europe
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Quantum Rehab Europe' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Quantum Rehab Europe', 'https://quantumrehab.eu', 'actief', 'Revalidatietechnologie')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'quantum-rehab-europe' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Quantum Rehab Europe', 'Een innovatief digitaal platform voor wereldwijd marktleider in geavanceerde elektrische rolstoelen, met maatwerk dealerportaal en interactieve productconfiguraties.', 'live', 'https://quantumrehab.eu', 'quantum-rehab-europe')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2025.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://quantumrehab.eu')
     WHERE id = v_project_id;
  END IF;

  -- Pride Mobility Europe
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Pride Mobility Europe' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Pride Mobility Europe', 'https://www.pridemobility.eu', 'actief', 'Mobiliteit & Healthcare')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'pride-mobility-europe' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Pride Mobility Europe', 'Een compleet nieuwe digitale ervaring voor het toonaangevende mobiliteitsmerk, met maatwerk dashboard, beveiligde login en interactieve productweergaven.', 'live', 'https://www.pridemobility.eu', 'pride-mobility-europe')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2025.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://www.pridemobility.eu')
     WHERE id = v_project_id;
  END IF;

  -- Puur in Harmonie
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Puur in Harmonie' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Puur in Harmonie', 'https://www.puurinharmonie.nl', 'actief', 'Holistische Salon')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'puur-in-harmonie' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Puur in Harmonie', 'Digitale rust en balans voor een holistische salon. Een minimalistische ervaring die even ontspannend is als de behandeling zelf.', 'live', 'https://www.puurinharmonie.nl', 'puur-in-harmonie')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2026.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://www.puurinharmonie.nl')
     WHERE id = v_project_id;
  END IF;

  -- BeNoted
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'BeNoted' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('BeNoted', 'https://benoted.nl', 'actief', 'Social Media Agency (Financiële Sector)')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'benoted' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'BeNoted', 'High-performance platform voor financiële marketing met AI-native development, enterprise-grade beveiliging en internationale schaalbaarheid.', 'live', 'https://benoted.nl', 'benoted')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2025 - 2026.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://benoted.nl')
     WHERE id = v_project_id;
  END IF;

  -- Danique Kwakman
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Danique Kwakman' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Danique Kwakman', 'https://daniquekwakman.nl', 'actief', 'Orthomoleculaire Therapie')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'danique-kwakman' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Danique Kwakman', 'Holistische gezondheidswebsite gericht op hormoonbalans, darmgezondheid en energie optimalisatie.', 'live', 'https://daniquekwakman.nl', 'danique-kwakman')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2023.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://daniquekwakman.nl')
     WHERE id = v_project_id;
  END IF;

  -- Erica van Dijk
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Erica van Dijk' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Erica van Dijk', 'https://ericavandijk.nl', 'actief', 'HR Interim & Advies')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'erica-van-dijk' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Erica van Dijk', 'Professionele website voor HR interim manager en adviseur met focus op expertise en vertrouwen.', 'live', 'https://ericavandijk.nl', 'erica-van-dijk')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://ericavandijk.nl')
     WHERE id = v_project_id;
  END IF;

  -- Bushido Shop
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Bushido Shop' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Bushido Shop', 'https://bushidoshop.nl', 'actief', 'E-commerce')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'bushido-shop' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Bushido Shop', 'E-commerce platform voor Japanse vechtsportartikelen en authentieke culturele items.', 'live', 'https://bushidoshop.nl', 'bushido-shop')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2023.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://bushidoshop.nl')
     WHERE id = v_project_id;
  END IF;

  -- Carbon6
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Carbon6' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Carbon6', 'https://carbon6.nl', 'actief', 'Vastgoed')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'carbon6' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Carbon6', 'Modern vastgoed platform met geavanceerde zoekfunctie en kamer browse features.', 'live', 'https://carbon6.nl', 'carbon6')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://carbon6.nl')
     WHERE id = v_project_id;
  END IF;

  -- Casper Nieskens PT
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Casper Nieskens PT' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Casper Nieskens PT', 'https://caspernieskenspt.com', 'actief', 'Personal Training')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'casper-nieskens-pt' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Casper Nieskens PT', 'Professioneel fitness coaching platform met gepersonaliseerde trainingsprogramma''s.', 'live', 'https://caspernieskenspt.com', 'casper-nieskens-pt')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://caspernieskenspt.com')
     WHERE id = v_project_id;
  END IF;

  -- Edventure Boats
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Edventure Boats' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Edventure Boats', 'https://edventureboats.com', 'actief', 'Avontuur & Toerisme')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'edventure-boats' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Edventure Boats', 'Water avontuur boekingsplatform voor spannende boot ervaringen.', 'live', 'https://edventureboats.com', 'edventure-boats')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2023.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://edventureboats.com')
     WHERE id = v_project_id;
  END IF;

  -- Esveld Installatie
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Esveld Installatie' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Esveld Installatie', 'https://esveldinstallatie.nl', 'actief', 'Installatiediensten')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'esveld-installatie' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Esveld Installatie', 'Professionele HVAC en installatiediensten website met klant portal.', 'live', 'https://esveldinstallatie.nl', 'esveld-installatie')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://esveldinstallatie.nl')
     WHERE id = v_project_id;
  END IF;

  -- Interieur Studio Laan
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Interieur Studio Laan' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Interieur Studio Laan', 'https://interieurstudiolaan.nl', 'actief', 'Interieur Design')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'interieur-studio-laan' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Interieur Studio Laan', 'Elegante interieur design showcase met portfolio galerij en consultatieaanvraag.', 'live', 'https://interieurstudiolaan.nl', 'interieur-studio-laan')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2023.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://interieurstudiolaan.nl')
     WHERE id = v_project_id;
  END IF;

  -- Karate School Cor Slok
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Karate School Cor Slok' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Karate School Cor Slok', 'https://karateschoolcorslok.nl', 'actief', 'Vechtsport')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'karate-school-cor-slok' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Karate School Cor Slok', 'Dynamische karateschool website met lesroosters en leden portal.', 'live', 'https://karateschoolcorslok.nl', 'karate-school-cor-slok')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://karateschoolcorslok.nl')
     WHERE id = v_project_id;
  END IF;

  -- Kyodai Originals
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Kyodai Originals' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Kyodai Originals', 'https://www.kyodaioriginals.nl', 'actief', 'Galerie voor Japanse Zwaarden & Antiek')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'kyodai-originals' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Kyodai Originals', 'Een digitale galerie voor museumwaardige Japanse zwaarden en wapenrustingen, gebouwd rondom authenticiteit, vertrouwen en verhalen over herkomst.', 'live', 'https://www.kyodaioriginals.nl', 'kyodai-originals')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2023.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://www.kyodaioriginals.nl')
     WHERE id = v_project_id;
  END IF;

  -- MHB Techniek
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'MHB Techniek' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('MHB Techniek', 'https://mhbtechniek.nl', 'actief', 'Technische Diensten')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'mhb-techniek' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'MHB Techniek', 'Smart home technologie oplossingen met service boeking en consultatie features.', 'live', 'https://mhbtechniek.nl', 'mhb-techniek')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://mhbtechniek.nl')
     WHERE id = v_project_id;
  END IF;

  -- Feitsma Dakwerken
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Feitsma Dakwerken' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Feitsma Dakwerken', 'https://feitsmadakwerken.nl', 'actief', 'Dakdekkersdiensten')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'feitsma-dakwerken' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Feitsma Dakwerken', 'Premium dakdekkersdiensten website met project showcase en consultatieaanvraag.', 'live', 'https://feitsmadakwerken.nl', 'feitsma-dakwerken')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://feitsmadakwerken.nl')
     WHERE id = v_project_id;
  END IF;

  -- Green Profit
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'Green Profit' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('Green Profit', 'https://green-profit.nl', 'actief', 'Duurzame Oplossingen')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'green-profit' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'Green Profit', 'Duurzaam bouwen en energie oplossingen platform met uitgebreid dienstenaanbod.', 'live', 'https://green-profit.nl', 'green-profit')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2023.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://green-profit.nl')
     WHERE id = v_project_id;
  END IF;

  -- RRS Royal
  SELECT id INTO v_client_id FROM public.clients WHERE name = 'RRS Royal' LIMIT 1;
  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (name, website, status, notes)
    VALUES ('RRS Royal', 'https://rrsroyal.nl', 'actief', 'Bouwpartner')
    RETURNING id INTO v_client_id;
  END IF;

  SELECT id INTO v_project_id FROM public.projects WHERE portfolio_slug = 'rrs-royal' LIMIT 1;
  v_created := v_project_id IS NULL;

  IF v_created THEN
    INSERT INTO public.projects (client_id, name, description, status, live_url, portfolio_slug)
    VALUES (v_client_id, 'RRS Royal', 'Complete bouwpartnership website met projectmanagement features.', 'live', 'https://rrsroyal.nl', 'rrs-royal')
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_updates (project_id, kind, body)
    VALUES (v_project_id, 'mijlpaal', 'Overgenomen uit het portfolio. Opgeleverd in 2024.');
  ELSE
    -- Bestaat al: alleen de koppelvelden bijwerken, de rest met rust laten.
    UPDATE public.projects
       SET client_id = COALESCE(client_id, v_client_id),
           live_url  = COALESCE(live_url, 'https://rrsroyal.nl')
     WHERE id = v_project_id;
  END IF;

END $seed$;
