import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeft, Globe, ShoppingCart, RefreshCw, HelpCircle, Check } from "lucide-react";

type ProjectType = "website" | "webshop" | "refresh" | "anders";
type BudgetRange = "tot-750" | "750-2000" | "meer-dan-2000";

interface FormData {
  // Step 1
  projectType: ProjectType | null;
  description: string;
  extraServices: string[];
  budget: BudgetRange | null;
  // Step 2
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  notes: string;
}

const projectOptions = [
  { value: "website" as ProjectType, label: "Website", icon: Globe },
  { value: "webshop" as ProjectType, label: "Webshop", icon: ShoppingCart },
  { value: "refresh" as ProjectType, label: "Bestaande website opfrissen", icon: RefreshCw },
  { value: "anders" as ProjectType, label: "Anders", icon: HelpCircle },
];

const extraServiceOptions = [
  { value: "seo", label: "Vindbaarheid verbeteren (SEO)" },
  { value: "logo", label: "Logo laten ontwerpen" },
  { value: "social", label: "Social media marketing" },
];

const budgetOptions = [
  { value: "tot-750" as BudgetRange, label: "Tot €750" },
  { value: "750-2000" as BudgetRange, label: "€750 - €2.000" },
  { value: "meer-dan-2000" as BudgetRange, label: "Meer dan €2.000" },
];

const ContactForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    projectType: null,
    description: "",
    extraServices: [],
    budget: null,
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleProjectTypeSelect = (type: ProjectType) => {
    setFormData(prev => ({ ...prev, projectType: type }));
  };

  const handleExtraServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      extraServices: prev.extraServices.includes(service)
        ? prev.extraServices.filter(s => s !== service)
        : [...prev.extraServices, service]
    }));
  };

  const handleBudgetSelect = (budget: BudgetRange) => {
    setFormData(prev => ({ ...prev, budget }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const canProceedToStep2 = formData.projectType !== null && formData.budget !== null;

  const handleNextStep = () => {
    if (canProceedToStep2) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const projectTypeLabel = projectOptions.find(p => p.value === formData.projectType)?.label || "";
    const budgetLabel = budgetOptions.find(b => b.value === formData.budget)?.label || "";
    const extraServicesLabels = formData.extraServices
      .map(s => extraServiceOptions.find(e => e.value === s)?.label)
      .filter(Boolean)
      .join(", ");

    const fullNotes = `
Type project: ${projectTypeLabel}
Budget: ${budgetLabel}
${formData.description ? `Korte beschrijving: ${formData.description}` : ""}
${extraServicesLabels ? `Extra diensten: ${extraServicesLabels}` : ""}
${formData.notes ? `Aanvullende opmerkingen: ${formData.notes}` : ""}
    `.trim();

    const data = {
      fullName: formData.fullName,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      notes: fullNotes,
    };

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: data,
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      toast.success("Bedankt! We nemen binnen 24 uur contact met je op.");
      navigate("/bedankt");
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error("Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via justin@nieuwblik.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
            step >= 1 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {step > 1 ? <Check className="w-5 h-5" /> : "1"}
          </div>
          <span className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
            Wensen
          </span>
          <div className="w-12 h-0.5 bg-muted mx-2">
            <div className={`h-full transition-all ${step >= 2 ? "bg-accent w-full" : "w-0"}`} />
          </div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
            step >= 2 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
          }`}>
            2
          </div>
          <span className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
            Gegevens
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8">
          {/* Project Type */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Wat zoek je? *</Label>
            <div className="grid grid-cols-2 gap-3">
              {projectOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.projectType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleProjectTypeSelect(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 hover:bg-muted/50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                    <span className={`font-medium ${isSelected ? "text-accent" : "text-foreground"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="description" className="text-lg font-semibold mb-2 block">
              Korte beschrijving
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Vertel ons in 1 zin wat je belangrijk vindt
            </p>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={200}
              placeholder="Bijv. Een moderne website die vertrouwen uitstraalt"
              className="bg-background"
            />
          </div>

          {/* Extra Services */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Extra diensten</Label>
            <div className="space-y-3">
              {extraServiceOptions.map((service) => {
                const isChecked = formData.extraServices.includes(service.value);
                return (
                  <label
                    key={service.value}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isChecked
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleExtraServiceToggle(service.value)}
                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <span className={`font-medium ${isChecked ? "text-accent" : "text-foreground"}`}>
                      {service.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Wat is je budget? *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {budgetOptions.map((option) => {
                const isSelected = formData.budget === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleBudgetSelect(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 hover:bg-muted/50"
                    }`}
                  >
                    <span className={`font-semibold ${isSelected ? "text-accent" : "text-foreground"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <Button
            type="button"
            onClick={handleNextStep}
            disabled={!canProceedToStep2}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Volgende stap
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Summary of Step 1 */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border mb-6">
            <p className="text-sm text-muted-foreground mb-1">Je selectie:</p>
            <p className="font-medium">
              {projectOptions.find(p => p.value === formData.projectType)?.label} • {budgetOptions.find(b => b.value === formData.budget)?.label}
              {formData.extraServices.length > 0 && (
                <span className="text-muted-foreground">
                  {" "}+ {formData.extraServices.length} extra {formData.extraServices.length === 1 ? "dienst" : "diensten"}
                </span>
              )}
            </p>
          </div>

          <div>
            <Label htmlFor="fullName">Volledige naam *</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={formData.fullName}
              onChange={handleInputChange}
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
              value={formData.companyName}
              onChange={handleInputChange}
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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-2"
              placeholder="+31 6 12345678"
            />
          </div>

          <div>
            <Label htmlFor="notes">Aanvullende opmerkingen</Label>
            <Textarea
              id="notes"
              name="notes"
              maxLength={1000}
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-2"
              placeholder="Vertel ons meer over je project... (optioneel)"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Terug
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSubmitting ? "Verzenden..." : "Verstuur aanvraag"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
