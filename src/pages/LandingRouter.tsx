import { useParams } from "react-router-dom";
import { getCityBySlug } from "@/data/cities";
import { getIndustryBySlug } from "@/data/industries";
import CityLanding from "./CityLanding";
import IndustryLanding from "./IndustryLanding";
import NotFound from "./NotFound";

const LandingRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <NotFound />;

  if (getCityBySlug(slug)) {
    // Render CityLanding via cloned param
    return <CityLandingProxy slug={slug} />;
  }
  if (getIndustryBySlug(slug)) {
    return <IndustryLandingProxy slug={slug} />;
  }
  return <NotFound />;
};

// Proxies inject the slug under the param name expected by each page
import { MemoryRouter, Routes, Route } from "react-router-dom";

const CityLandingProxy = ({ slug }: { slug: string }) => {
  return (
    <MemoryRouterShim slug={slug} param="citySlug">
      <CityLanding />
    </MemoryRouterShim>
  );
};

const IndustryLandingProxy = ({ slug }: { slug: string }) => {
  return (
    <MemoryRouterShim slug={slug} param="industrySlug">
      <IndustryLanding />
    </MemoryRouterShim>
  );
};

// Shim that provides a synthetic useParams result without nesting routers
import { createContext, useContext } from "react";
const SlugCtx = createContext<{ slug: string; param: string } | null>(null);

const MemoryRouterShim = ({ slug, param, children }: { slug: string; param: string; children: React.ReactNode }) => {
  return <SlugCtx.Provider value={{ slug, param }}>{children}</SlugCtx.Provider>;
};

export const useLandingSlug = (param: string) => {
  const ctx = useContext(SlugCtx);
  if (ctx && ctx.param === param) return ctx.slug;
  return undefined;
};

export default LandingRouter;
