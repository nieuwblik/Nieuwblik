import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

interface ContactBlockProps {
  h2: string;
  body: string;
}

const ContactBlock = ({ h2, body }: ContactBlockProps) => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-background rounded-2xl p-8 md:p-12 shadow-sm border border-border">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{h2}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{body}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <a
              href="tel:+31646253607"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bel direct</p>
                <p className="font-semibold text-foreground">06 46 25 36 07</p>
              </div>
            </a>

            <a
              href="https://wa.me/31646253607"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="font-semibold text-foreground">Stuur een bericht</p>
              </div>
            </a>

            <a
              href="mailto:info@nieuwblik.com"
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="font-semibold text-foreground">info@nieuwblik.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Adres</p>
                <p className="font-semibold text-foreground text-sm">De Trompet 18H, 1601 MK Enkhuizen</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">
                Start je project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">KVK: 99229781</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBlock;
