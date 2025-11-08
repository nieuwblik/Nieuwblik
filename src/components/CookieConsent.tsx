import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg animate-slide-in-bottom">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">We gebruiken cookies</h3>
              <p className="text-sm text-muted-foreground">
                We gebruiken cookies om je ervaring te verbeteren en onze website te optimaliseren. Door op "Accepteren" te klikken, stem je in met ons gebruik van cookies.
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={declineCookies}
              className="flex-1 md:flex-none"
            >
              Weigeren
            </Button>
            <Button
              onClick={acceptCookies}
              className="flex-1 md:flex-none bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Accepteren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
