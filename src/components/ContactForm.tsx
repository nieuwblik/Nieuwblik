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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { easings, staggerContainer, staggerItem } from "@/lib/motion";

type ProjectType = "website" | "webshop" | "refresh" | "anders";
type BudgetRange = "tot-750" | "750-2000" | "meer-dan-2000";

interface FormData {
  projectType: ProjectType | null;
  description: string;
  extraServices: string[];
  budget: BudgetRange | null;
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
  const shouldReduceMotion = useReducedMotion();
  
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

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0']
      });

      toast.success("Bedankt! We nemen binnen 24 uur contact met je op.");
      
      setTimeout(() => {
        navigate("/bedankt");
      }, 1500);
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      toast.error("Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via justin@nieuwblik.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.4,
        ease: easings.easeOutExpo,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.25,
        ease: easings.easeInOutQuart,
      },
    }),
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <motion.div 
        className="flex items-center justify-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easings.easeOutExpo }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
              step >= 1 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
            animate={step > 1 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {step > 1 ? (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3, ease: easings.softBounce }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            ) : "1"}
          </motion.div>
          <span className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
            Wensen
          </span>
          <div className="w-12 h-0.5 bg-muted mx-2 overflow-hidden">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: step >= 2 ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: easings.easeOutExpo }}
            />
          </div>
          <motion.div 
            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
              step >= 2 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
            animate={step === 2 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            2
          </motion.div>
          <span className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
            Gegevens
          </span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait" custom={step}>
        {step === 1 && (
          <motion.div
            key="step1"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-8"
          >
            {/* Project Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: easings.easeOutExpo }}
            >
              <Label className="text-lg font-semibold mb-4 block">Wat zoek je? *</Label>
              <div className="grid grid-cols-2 gap-3">
                {projectOptions.map((option, index) => {
                  const Icon = option.icon;
                  const isSelected = formData.projectType === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleProjectTypeSelect(option.value)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left flex items-center gap-3 ${
                        isSelected
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50 hover:bg-muted/50"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.05, duration: 0.3, ease: easings.easeOutExpo }}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                      <span className={`font-medium ${isSelected ? "text-accent" : "text-foreground"}`}>
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Short Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: easings.easeOutExpo }}
            >
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
            </motion.div>

            {/* Extra Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: easings.easeOutExpo }}
            >
              <Label className="text-lg font-semibold mb-4 block">Extra diensten</Label>
              <div className="space-y-3">
                {extraServiceOptions.map((service, index) => {
                  const isChecked = formData.extraServices.includes(service.value);
                  return (
                    <motion.label
                      key={service.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        isChecked
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50 hover:bg-muted/50"
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.3, ease: easings.easeOutExpo }}
                      whileHover={shouldReduceMotion ? {} : { x: 4 }}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleExtraServiceToggle(service.value)}
                        className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <span className={`font-medium ${isChecked ? "text-accent" : "text-foreground"}`}>
                        {service.label}
                      </span>
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>

            {/* Budget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: easings.easeOutExpo }}
            >
              <Label className="text-lg font-semibold mb-4 block">Wat is je budget? *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {budgetOptions.map((option, index) => {
                  const isSelected = formData.budget === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleBudgetSelect(option.value)}
                      className={`p-4 rounded-lg border-2 transition-colors text-center ${
                        isSelected
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50 hover:bg-muted/50"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.3, ease: easings.easeOutExpo }}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    >
                      <span className={`font-semibold ${isSelected ? "text-accent" : "text-foreground"}`}>
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Next Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4, ease: easings.easeOutExpo }}
            >
              <motion.div
                whileHover={shouldReduceMotion || !canProceedToStep2 ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion || !canProceedToStep2 ? {} : { scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!canProceedToStep2}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Volgende stap
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            custom={2}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Summary of Step 1 */}
            <motion.div 
              className="p-4 rounded-lg bg-muted/50 border border-border mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3, ease: easings.easeOutExpo }}
            >
              <p className="text-sm text-muted-foreground mb-1">Je selectie:</p>
              <p className="font-medium">
                {projectOptions.find(p => p.value === formData.projectType)?.label} • {budgetOptions.find(b => b.value === formData.budget)?.label}
                {formData.extraServices.length > 0 && (
                  <span className="text-muted-foreground">
                    {" "}+ {formData.extraServices.length} extra {formData.extraServices.length === 1 ? "dienst" : "diensten"}
                  </span>
                )}
              </p>
            </motion.div>

            {[
              { id: "fullName", label: "Volledige naam *", type: "text", required: true, placeholder: "Jan de Vries" },
              { id: "companyName", label: "Bedrijfsnaam", type: "text", required: false, placeholder: "Uw bedrijf (optioneel)" },
              { id: "email", label: "E-mailadres *", type: "email", required: true, placeholder: "jan@voorbeeld.nl" },
              { id: "phone", label: "Telefoonnummer *", type: "tel", required: true, placeholder: "+31 6 12345678" },
            ].map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05, duration: 0.3, ease: easings.easeOutExpo }}
              >
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required={field.required}
                  value={(formData as unknown as Record<string, string>)[field.id]}
                  onChange={handleInputChange}
                  className="mt-2"
                  placeholder={field.placeholder}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3, ease: easings.easeOutExpo }}
            >
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
            </motion.div>

            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3, ease: easings.easeOutExpo }}
            >
              <motion.div
                className="flex-1"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Terug
                </Button>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={shouldReduceMotion || isSubmitting ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion || isSubmitting ? {} : { scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Verzenden...
                    </motion.span>
                  ) : "Verstuur aanvraag"}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
