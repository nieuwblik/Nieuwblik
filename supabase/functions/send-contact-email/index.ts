import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProjectBriefingRequest {
  fullName: string;
  companyName: string;
  position: string;
  email: string;
  phone?: string;
  projectTypes: string[];
  projectGoal: string;
  currentWebsite?: string;
  inspirationWebsite?: string;
  budget: string;
  timeline: string;
  contentReady: string;
  brandKitAvailable: string;
  portfolioAppeal?: string;
  additionalNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ProjectBriefingRequest = await req.json();

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
      <p><strong>Belangrijkste doel:</strong> ${data.projectGoal}</p>
      ${data.currentWebsite ? `<p><strong>Huidige website:</strong> ${data.currentWebsite}</p>` : ''}
      ${data.inspirationWebsite ? `<p><strong>Inspiratie website:</strong> ${data.inspirationWebsite}</p>` : ''}
      
      <h2>Stap 3: Omvang & Specificaties</h2>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Gewenste timeline:</strong> ${data.timeline}</p>
      <p><strong>Content beschikbaar:</strong> ${data.contentReady}</p>
      <p><strong>Brandkit beschikbaar:</strong> ${data.brandKitAvailable}</p>
      
      <h2>Stap 4: Match & Afronding</h2>
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
        from: "Nieuwblik Contact <onboarding@resend.dev>",
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
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
