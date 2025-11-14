import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ClientTooltipProviderProps {
  children: React.ReactNode;
}

const ClientTooltipProvider = ({ children }: ClientTooltipProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return <TooltipProvider>{children}</TooltipProvider>;
};

export default ClientTooltipProvider;
