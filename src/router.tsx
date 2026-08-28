import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Vervangt het oude voorladen-op-intentie uit App.tsx: chunks van een
    // route worden opgehaald zodra de muis boven een link hangt.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
