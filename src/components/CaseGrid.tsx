import PortfolioCard from "@/components/PortfolioCard";
import type { Project } from "@/data/projects";

/**
 * Het caseraster van de portfoliopagina, voor hergebruik op de stad-, branche-,
 * werkgebied- en regiopagina's. Die hadden elk hun eigen kaart (ProjectCard met
 * hoverknoppen, of een eigen kaartje op de regiopagina's), waardoor dezelfde
 * cases er per pagina anders uitzagen.
 *
 * Alleen het raster, niet de kop of de knop eronder: die verschillen per pagina
 * en blijven daar staan.
 */
export default function CaseGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-20">
      {projects.map((project) => (
        <PortfolioCard
          key={project.slug}
          title={project.title}
          category={project.category}
          description={project.description}
          image={project.image}
          {...(project.imageSet ? { imageSet: project.imageSet } : {})}
          slug={project.slug}
          meta={project.tags.slice(0, 2).join(" · ")}
        />
      ))}
    </div>
  );
}
