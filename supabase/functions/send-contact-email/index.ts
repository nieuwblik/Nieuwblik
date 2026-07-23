import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 submissions per hour per IP

async function isRateLimited(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error } = await admin
    .from("contact_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", since);

  if (error) {
    console.error("Rate limit check failed:", error);
    // Fail closed on errors to avoid abuse
    return true;
  }
  if ((count ?? 0) >= RATE_LIMIT_MAX) return true;

  await admin.from("contact_rate_limits").insert({ ip_address: ip });
  return false;
}

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
  subject?: string;
}

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  companyName: z.string().trim().max(100, "Company name too long").optional(),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().trim().regex(/^[0-9+\s\-()]{10,20}$/, "Invalid phone number").max(20, "Phone number too long"),
  notes: z.string().trim().max(1000, "Notes too long").optional(),
  // Optional override for the email subject (e.g. a distinct lead form like
  // the free website analysis request) - falls back to the default contact
  // form subject below when omitted.
  subject: z.string().trim().max(150, "Subject too long").optional(),
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (await isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const rawData: ContactRequest = await req.json();

    const validationResult = contactSchema.safeParse(rawData);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ error: "Invalid input data. Please check your form fields." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = validationResult.data;

    const emailHtml = `
      <h1>Nieuw contactformulier bericht van ${escapeHtml(data.fullName)}</h1>
      
      <p><strong>Volledige Naam:</strong> ${escapeHtml(data.fullName)}</p>
      ${data.companyName ? `<p><strong>Bedrijfsnaam:</strong> ${escapeHtml(data.companyName)}</p>` : ''}
      <p><strong>E-mailadres:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefoonnummer:</strong> ${escapeHtml(data.phone)}</p>
      ${data.notes ? `<p><strong>Opmerkingen:</strong></p><p>${escapeHtml(data.notes).replace(/\n/g, '<br>')}</p>` : ''}
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
        subject: data.subject || `Nieuw contactformulier van ${data.fullName}${data.companyName ? ' - ' + data.companyName : ''}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent successfully");

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
