import { useParams } from "react-router-dom";
import { getCityBySlug } from "@/data/cities";
import { getIndustryBySlug } from "@/data/industries";
import CityLanding from "./CityLanding";
import IndustryLanding from "./IndustryLanding";
import NotFound from "./NotFound";

const PREFIX = "website-laten-maken-";

const LandingRouter = () => {
  const { landingPath } = useParams<{ landingPath: string }>();
  if (!landingPath || !landingPath.startsWith(PREFIX)) return <NotFound />;
  const slug = landingPath.slice(PREFIX.length);
  if (getCityBySlug(slug)) return <CityLanding slug={slug} />;
  if (getIndustryBySlug(slug)) return <IndustryLanding slug={slug} />;
  return <NotFound />;
};

export default LandingRouter;
