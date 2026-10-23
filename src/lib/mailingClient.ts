import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Local schema extension for the pending mailing migration. Keep generated types untouched.
type Clients = Database["public"]["Tables"]["clients"];
type Mailing = {
  id: string;
  onderwerp: string;
  tekst: string;
  statussen: string[];
  aantal_ontvangers: number;
  aantal_mislukt: number;
  verstuurd_door: string | null;
  created_at: string;
};
type Ontvanger = {
  id: string;
  mailing_id: string;
  client_id: string | null;
  email: string;
  naam: string | null;
  status: string;
  fout: string | null;
  resend_id: string | null;
  created_at: string;
};
type MailingDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Functions"> & {
    Tables: Omit<Database["public"]["Tables"], "clients"> & {
      clients: {
        Row: Clients["Row"] & { mail_afmeld_token: string; mail_afgemeld_op: string | null };
        Insert: Clients["Insert"] & { mail_afmeld_token?: string; mail_afgemeld_op?: string | null };
        Update: Clients["Update"] & { mail_afmeld_token?: string; mail_afgemeld_op?: string | null };
        Relationships: Clients["Relationships"];
      };
      mailings: {
        Row: Mailing;
        Insert: Pick<Mailing, "onderwerp" | "tekst"> & Partial<Omit<Mailing, "onderwerp" | "tekst">>;
        Update: Partial<Mailing>;
        Relationships: [];
      };
      mailing_ontvangers: {
        Row: Ontvanger;
        Insert: Pick<Ontvanger, "mailing_id" | "email"> & Partial<Omit<Ontvanger, "mailing_id" | "email">>;
        Update: Partial<Ontvanger>;
        Relationships: [{ foreignKeyName: "mailing_ontvangers_mailing_id_fkey"; columns: ["mailing_id"]; isOneToOne: false; referencedRelation: "mailings"; referencedColumns: ["id"] }];
      };
    };
    Functions: Database["public"]["Functions"] & {
      mail_afmelden: { Args: { _token: string }; Returns: boolean };
    };
  };
};

// Reuse the existing authenticated client, without changing authentication or database state.
export const mailingClient = supabase as unknown as SupabaseClient<MailingDatabase>;