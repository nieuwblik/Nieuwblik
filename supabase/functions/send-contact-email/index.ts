import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactRequest = await req.json();

    const emailHtml = `
      <h1>Nieuw contactformulier bericht van ${data.fullName}</h1>
      
      <p><strong>Volledige Naam:</strong> ${data.fullName}</p>
      ${data.companyName ? `<p><strong>Bedrijfsnaam:</strong> ${data.companyName}</p>` : ''}
      <p><strong>E-mailadres:</strong> ${data.email}</p>
      <p><strong>Telefoonnummer:</strong> ${data.phone}</p>
      ${data.notes ? `<p><strong>Opmerkingen:</strong></p><p>${data.notes}</p>` : ''}
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
        subject: `Nieuw contactformulier van ${data.fullName}${data.companyName ? ' - ' + data.companyName : ''}`,
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
      JSON.stringify({ error: "Failed to send email. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
