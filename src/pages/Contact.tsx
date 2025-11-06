import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Contact = () => {
  const handleQuickInquiry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you within 24 hours.");
  };

  const handleProjectBriefing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Thank you for your detailed submission! We'll review and respond within 48 hours.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <p className="text-accent-light text-accent mb-6">GET IN TOUCH</p>
          <h1 className="text-display mb-6">
            Start Your Project
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light">
            Whether you have a quick question or a detailed project in mind, we're here to help bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="quick" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger value="quick">Quick Inquiry</TabsTrigger>
              <TabsTrigger value="detailed">Project Briefing</TabsTrigger>
            </TabsList>
            
            {/* Quick Inquiry Form */}
            <TabsContent value="quick">
              <div className="bg-secondary p-8 md:p-12 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Quick Inquiry</h2>
                <p className="text-muted-foreground mb-8 font-light">
                  Have a general question? Send us a quick message and we'll respond within 24 hours.
                </p>
                <form onSubmit={handleQuickInquiry} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" required className="mt-2" placeholder="Your name" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required className="mt-2" placeholder="your@email.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="branding">Branding</SelectItem>
                        <SelectItem value="custom">Custom Design</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="question">Your Question *</Label>
                    <Textarea 
                      id="question" 
                      required 
                      className="mt-2 min-h-[120px]" 
                      placeholder="Tell us what you'd like to know..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Send Message
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            {/* Project Briefing Form */}
            <TabsContent value="detailed">
              <div className="bg-secondary p-8 md:p-12 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Project Briefing</h2>
                <p className="text-muted-foreground mb-8 font-light">
                  Ready to start a project? Provide us with detailed information to receive an accurate quote and timeline.
                </p>
                <form onSubmit={handleProjectBriefing} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Your Name & Position *</Label>
                      <Input id="fullName" required className="mt-2" placeholder="John Doe, CEO" />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input id="company" required className="mt-2" placeholder="Your Company" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="currentWebsite">Current Website (if applicable)</Label>
                    <Input id="currentWebsite" type="url" className="mt-2" placeholder="https://yourwebsite.com" />
                  </div>
                  
                  <div>
                    <Label>Primary Project Type *</Label>
                    <div className="mt-3 space-y-2">
                      {["New Website", "Website Redesign", "Full Brand Kit", "Custom Design", "Other"].map((type) => (
                        <label key={type} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-input" />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="projectGoal">Core Project Goal *</Label>
                    <Textarea 
                      id="projectGoal" 
                      required 
                      className="mt-2 min-h-[120px]" 
                      placeholder="What should this project achieve? What are your main objectives?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="audience">Target Audience *</Label>
                    <Input id="audience" required className="mt-2" placeholder="e.g., B2B, B2C, Local market, etc." />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="startDate">Desired Start Date *</Label>
                      <Select required>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">As soon as possible</SelectItem>
                          <SelectItem value="1month">Within 1 month</SelectItem>
                          <SelectItem value="1-3months">1-3 months</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="budget">Budget Range *</Label>
                      <Select required>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5-10k">€5,000 - €10,000</SelectItem>
                          <SelectItem value="10k+">€10,000+</SelectItem>
                          <SelectItem value="undecided">Undecided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contentReady">Do you have content ready? *</Label>
                    <Select required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, content is ready</SelectItem>
                        <SelectItem value="no">No, need copywriting support</SelectItem>
                        <SelectItem value="partial">Partially ready</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="referral">How did you find Nieuwblik?</Label>
                    <Input id="referral" className="mt-2" placeholder="Google, Referral, Social Media, etc." />
                  </div>
                  
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Submit Project Brief
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
