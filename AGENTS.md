# Projectregels

- Houd actiegerichte metadata en zichtbare koppen voor handgeschreven stadspagina's bij in `cityLokaal`, zodat gegenereerde basisdata veilig opnieuw kan worden opgebouwd.
- Genereer `robots.txt` uitsluitend via de sitemapgenerator, omdat iedere build het publieke bestand opnieuw schrijft.

- Store each article's category in the blog data and define the shared category union in `src/data/blogCategories.ts`, so overview filters and article labels use the same source.