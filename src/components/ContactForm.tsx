import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      companyName: formData.get("companyName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: data,
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      toast.success("Bedankt! We nemen binnen 48 uur contact met je op.");
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error("Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via justin@nieuwblik.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="fullName">Volledige naam *</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          required
          minLength={2}
          maxLength={100}
          className="mt-2"
          placeholder="Jan de Vries"
        />
      </div>

      <div>
        <Label htmlFor="companyName">Bedrijfsnaam</Label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          maxLength={100}
          className="mt-2"
          placeholder="Uw bedrijf (optioneel)"
        />
      </div>

      <div>
        <Label htmlFor="email">E-mailadres *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={255}
          className="mt-2"
          placeholder="jan@voorbeeld.nl"
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefoonnummer *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          pattern="[0-9+\s\-()]{10,20}"
          maxLength={20}
          className="mt-2"
          placeholder="+31 6 12345678"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isSubmitting ? "Verzenden..." : "Verstuur aanvraag"}
      </Button>
    </form>
  );
};

export default ContactForm;
