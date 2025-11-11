import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const projectBriefingSchema = z.object({
  fullName: z.string().trim().min(1, "Naam is verplicht").max(100),
  companyName: z.string().trim().min(1, "Bedrijfsnaam is verplicht").max(100),
  position: z.string().trim().min(1, "Functie is verplicht").max(100),
  email: z.string().trim().email("Ongeldig e-mailadres").max(255),
  phone: z.string().trim().max(20).optional(),
  projectTypes: z.array(z.string()).min(1, "Selecteer minimaal één projecttype").max(10),
  otherProjectType: z.string().trim().max(200).optional(),
  projectGoal: z.string().trim().min(1, "Projectdoel is verplicht").max(1000),
  currentWebsite: z.string().trim().url("Ongeldige URL").max(500).optional().or(z.literal("")),
  inspirationWebsite: z.string().trim().url("Ongeldige URL").max(500).optional().or(z.literal("")),
  budget: z.string().trim().min(1, "Budget is verplicht").max(100),
  timeline: z.string().trim().min(1, "Timeline is verplicht").max(100),
  contentReady: z.string().trim().min(1, "Selecteer een optie").max(100),
  brandKitAvailable: z.string().trim().min(1, "Selecteer een optie").max(100),
  howDidYouFindUs: z.string().trim().min(1, "Selecteer hoe je ons hebt gevonden").max(200),
  portfolioAppeal: z.string().trim().max(500).optional(),
  additionalNotes: z.string().trim().max(1000).optional(),
});

interface FormData {
  fullName: string;
  companyName: string;
  position: string;
  email: string;
  phone: string;
  projectTypes: string[];
  otherProjectType: string;
  projectGoal: string;
  currentWebsite: string;
  inspirationWebsite: string;
  budget: string;
  timeline: string;
  contentReady: string;
  brandKitAvailable: string;
  portfolioAppeal: string;
  howDidYouFindUs: string;
  additionalNotes: string;
}

const ProjectBriefingForm = () => {
  const STORAGE_KEY = 'nieuwblik-contact-form-draft';
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    position: "",
    email: "",
    phone: "",
    projectTypes: [],
    otherProjectType: "",
    projectGoal: "",
    currentWebsite: "",
    inspirationWebsite: "",
    budget: "",
    timeline: "",
    contentReady: "",
    brandKitAvailable: "",
    portfolioAppeal: "",
    howDidYouFindUs: "",
    additionalNotes: "",
  });

  // Load saved form data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData);
        setStep(parsed.step || 1);
        toast.info("Je eerder begonnen formulier is hersteld");
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
  }, []);

  // Auto-save form data when it changes
  useEffect(() => {
    const saveData = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, step }));
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }, 1000); // Debounce save by 1 second

    return () => clearTimeout(saveData);
  }, [formData, step]);

  const projectTypeOptions = [
    "Nieuwe Website (vanaf nul)",
    "Herontwerp / Redesign van Bestaande Site",
    "Complete Brandkit / Huisstijlontwikkeling",
    "Specifiek Grafisch Design (e-book, banners, etc.)",
    "Ander",
  ];

  const handleProjectTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter(t => t !== type)
        : [...prev.projectTypes, type]
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validationResult = projectBriefingSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const firstError = Object.values(validationResult.error.flatten().fieldErrors)[0]?.[0];
        toast.error(firstError || "Controleer alle verplichte velden");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: validationResult.data
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      // Clear saved form data after successful submission
      localStorage.removeItem(STORAGE_KEY);
      toast.success("Bedankt! We nemen binnen 48 uur contact met je op.");
      window.location.href = '/bedankt';
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error("Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via justin@nieuwblik.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="text-xs text-muted-foreground text-right">
          💾 Automatisch opgeslagen om {lastSaved.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                s === step
                  ? "bg-accent text-accent-foreground"
                  : s < step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  s < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basisgegevens */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Stap 1: Jouw basisgegevens</h3>
          <div>
            <Label htmlFor="fullName">Volledige naam *</Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="companyName">Bedrijfsnaam *</Label>
            <Input
              id="companyName"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="position">Jouw functie/positie *</Label>
            <Input
              id="position"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">E-mailadres *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefoonnummer (optioneel)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      )}

      {/* Step 2: Projectkern */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Stap 2: Projectkern</h3>
          <div>
            <Label>Wat is de hoofdreden voor dit project? *</Label>
            <div className="mt-3 space-y-3">
              {projectTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.projectTypes.includes(type)}
                    onCheckedChange={() => handleProjectTypeChange(type)}
                  />
                  <label htmlFor={type} className="text-sm cursor-pointer">
                    {type}
                  </label>
                </div>
              ))}
            </div>
            {formData.projectTypes.includes("Ander") && (
              <Input
                placeholder="Specificeer wat je nodig hebt..."
                value={formData.otherProjectType}
                onChange={(e) => setFormData({ ...formData, otherProjectType: e.target.value })}
                className="mt-3"
              />
            )}
          </div>
          <div>
            <Label htmlFor="projectGoal">Belangrijkste doel van dit project *</Label>
            <Textarea
              id="projectGoal"
              required
              value={formData.projectGoal}
              onChange={(e) => setFormData({ ...formData, projectGoal: e.target.value })}
              className="mt-2 min-h-[100px]"
              placeholder="Bijv. Meer leads genereren, E-commerce verkopen verhogen"
            />
          </div>
          <div>
            <Label htmlFor="currentWebsite">Huidige website (URL)</Label>
            <Input
              id="currentWebsite"
              type="url"
              value={formData.currentWebsite}
              onChange={(e) => setFormData({ ...formData, currentWebsite: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="inspirationWebsite">Website waarvan je de stijl mooi vindt (URL)</Label>
            <Input
              id="inspirationWebsite"
              type="url"
              value={formData.inspirationWebsite}
              onChange={(e) => setFormData({ ...formData, inspirationWebsite: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      )}

      {/* Step 3: Omvang & Specificaties */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Stap 3: Omvang & specificaties</h3>
          <div>
            <Label htmlFor="budget">Budget *</Label>
            <Input
              id="budget"
              required
              type="text"
              placeholder="Bijvoorbeeld: €3.500 of €10.000"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="timeline">Wanneer wil je dat het project live gaat? *</Label>
            <Select required value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecteer tijdlijn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">Binnen 1 week (Zeer spoed)</SelectItem>
                <SelectItem value="1month">Binnen 1 maand (Spoed)</SelectItem>
                <SelectItem value="1-3months">1 tot 3 maanden</SelectItem>
                <SelectItem value="3-6months">3 tot 6 maanden</SelectItem>
                <SelectItem value="unsure">Nog niet zeker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="contentReady">Is de benodigde content al beschikbaar? *</Label>
            <Select required value={formData.contentReady} onValueChange={(value) => setFormData({ ...formData, contentReady: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecteer optie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Ja, alles is klaar</SelectItem>
                <SelectItem value="no">Nee, we hebben hulp nodig met content/copywriting</SelectItem>
                <SelectItem value="partial">Gedeeltelijk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="brandKitAvailable">Is er al een bestaande huisstijl/brandkit? *</Label>
            <Select required value={formData.brandKitAvailable} onValueChange={(value) => setFormData({ ...formData, brandKitAvailable: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecteer optie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Ja</SelectItem>
                <SelectItem value="no">Nee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Step 4: Match & Afronding */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Stap 4: Match & afronding</h3>
          <div>
            <Label htmlFor="howDidYouFindUs">Hoe ben je op ons gekomen? *</Label>
            <Select required value={formData.howDidYouFindUs} onValueChange={(value) => setFormData({ ...formData, howDidYouFindUs: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecteer optie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social media</SelectItem>
                <SelectItem value="internet">Internet / Zoekmachine</SelectItem>
                <SelectItem value="chatgpt">ChatGPT</SelectItem>
                <SelectItem value="friends">Vrienden</SelectItem>
                <SelectItem value="family">Familie</SelectItem>
                <SelectItem value="neighbors">Buren</SelectItem>
                <SelectItem value="business">Bedrijven / Netwerk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="portfolioAppeal">Wat spreekt je het meest aan in de portfolio of stijl van Nieuwblik?</Label>
            <Textarea
              id="portfolioAppeal"
              value={formData.portfolioAppeal}
              onChange={(e) => setFormData({ ...formData, portfolioAppeal: e.target.value })}
              className="mt-2 min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="additionalNotes">Overige opmerkingen, vragen of vereisten</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="mt-2 min-h-[120px]"
            />
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        {step > 1 && (
          <Button type="button" onClick={handlePrevious} variant="outline">
            Vorige
          </Button>
        )}
        {step < 4 ? (
          <Button type="button" onClick={handleNext} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
            Volgende
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
            {isSubmitting ? "Verzenden..." : "Versturen"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProjectBriefingForm;
