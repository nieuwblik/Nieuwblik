import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const projectBriefingSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  companyName: z.string().trim().min(1).max(100),
  position: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  projectTypes: z.array(z.string()).min(1).max(10),
  otherProjectType: z.string().trim().max(200).optional(),
  projectGoal: z.string().trim().min(1).max(1000),
  currentWebsite: z.string().trim().url().max(500).optional().or(z.literal("")),
  inspirationWebsite: z.string().trim().url().max(500).optional().or(z.literal("")),
  budget: z.string().trim().min(1).max(100),
  timeline: z.string().trim().min(1).max(100),
  contentReady: z.string().trim().min(1).max(100),
  brandKitAvailable: z.string().trim().min(1).max(100),
  howDidYouFindUs: z.string().trim().min(1).max(200),
  portfolioAppeal: z.string().trim().max(500).optional(),
  additionalNotes: z.string().trim().max(1000).optional(),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input
    const validationResult = projectBriefingSchema.safeParse(rawData);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input data", details: validationResult.error.format() }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const data = validationResult.data;

    const emailHtml = `
      <h1>Nieuwe Project Briefing van ${data.fullName}</h1>
      
      <h2>Stap 1: Basisgegevens</h2>
      <p><strong>Volledige Naam:</strong> ${data.fullName}</p>
      <p><strong>Bedrijfsnaam:</strong> ${data.companyName}</p>
      <p><strong>Functie/Positie:</strong> ${data.position}</p>
      <p><strong>E-mailadres:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Telefoonnummer:</strong> ${data.phone}</p>` : ''}
      
      <h2>Stap 2: Projectkern</h2>
      <p><strong>Hoofdreden voor project:</strong> ${data.projectTypes.join(', ')}</p>
      ${data.otherProjectType ? `<p><strong>Andere specificatie:</strong> ${data.otherProjectType}</p>` : ''}
      <p><strong>Belangrijkste doel:</strong> ${data.projectGoal}</p>
      ${data.currentWebsite ? `<p><strong>Huidige website:</strong> ${data.currentWebsite}</p>` : ''}
      ${data.inspirationWebsite ? `<p><strong>Inspiratie website:</strong> ${data.inspirationWebsite}</p>` : ''}
      
      <h2>Stap 3: Omvang & Specificaties</h2>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Gewenste timeline:</strong> ${data.timeline}</p>
      <p><strong>Content beschikbaar:</strong> ${data.contentReady}</p>
      <p><strong>Brandkit beschikbaar:</strong> ${data.brandKitAvailable}</p>
      
      <h2>Stap 4: Match & Afronding</h2>
      <p><strong>Hoe gevonden:</strong> ${data.howDidYouFindUs}</p>
      ${data.portfolioAppeal ? `<p><strong>Wat spreekt aan in portfolio:</strong> ${data.portfolioAppeal}</p>` : ''}
      ${data.additionalNotes ? `<p><strong>Overige opmerkingen:</strong> ${data.additionalNotes}</p>` : ''}
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Nieuwblik Contact <contact@nieuwblik.com>",
        to: ["justin@nieuwblik.com"],
        reply_to: data.email,
        subject: `Nieuwe Project Briefing van ${data.fullName} - ${data.companyName}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function");
    return new Response(
      JSON.stringify({ error: "Failed to send email. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
