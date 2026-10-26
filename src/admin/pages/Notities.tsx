import NotitieWerkplek from "@/admin/components/NotitieWerkplek";

/**
 * Notities: alle aantekeningen, los of bij een klant, met een filter per
 * klant. Per klant staan ze ook op de klantpagina, onder het tabblad Notities.
 */
const Notities = () => (
  <div className="mx-auto max-w-[1400px]">
    <NotitieWerkplek kop={<h1 className="text-2xl tracking-tight">Notities</h1>} />
  </div>
);

export default Notities;
