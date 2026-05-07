import { useParams } from "react-router-dom";
import { getCityBySlug } from "@/data/cities";
import { getIndustryBySlug } from "@/data/industries";
import CityLanding from "./CityLanding";
import IndustryLanding from "./IndustryLanding";
import NotFound from "./NotFound";

const LandingRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <NotFound />;
  if (getCityBySlug(slug)) return <CityLanding />;
  if (getIndustryBySlug(slug)) return <IndustryLanding />;
  return <NotFound />;
};

export default LandingRouter;
