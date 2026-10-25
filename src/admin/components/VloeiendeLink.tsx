import type { MouseEvent } from "react";
import { Link, type LinkProps } from "react-router-dom";

import { useVloeiendNaar } from "@/admin/vloeiend";

/**
 * Een gewone link, maar met de vloeiende paginaovergang. Met een
 * modifiertoets of de middelste muisknop gedraagt hij zich als een normale
 * link (nieuw tabblad en dergelijke).
 */
const VloeiendeLink = ({ to, onClick, ...rest }: LinkProps & { to: string }) => {
  const naar = useVloeiendNaar();
  return (
    <Link
      to={to}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        naar(to);
      }}
      {...rest}
    />
  );
};

export default VloeiendeLink;
