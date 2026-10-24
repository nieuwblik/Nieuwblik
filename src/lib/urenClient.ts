import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Lokale uitbreiding voor de urenregistratie zolang de migratie
// (20261024140000_urenregistratie.sql) nog niet is uitgevoerd en de
// gegenereerde types de tabel nog niet kennen. De gegenereerde bestanden
// blijven zo ongemoeid. Weghalen zodra types.ts time_entries bevat.
export type TimeEntry = {
  id: string;
  user_id: string;
  project_id: string | null;
  task_id: string | null;
  description: string | null;
  started_at: string;
  ended_at: string | null;
  billable: boolean;
  created_at: string;
  updated_at: string;
};

type UrenDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & {
      time_entries: {
        Row: TimeEntry;
        Insert: Pick<TimeEntry, "user_id"> & Partial<Omit<TimeEntry, "user_id">>;
        Update: Partial<TimeEntry>;
        Relationships: [
          {
            foreignKeyName: "time_entries_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "time_entries_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
    };
  };
};

// Dezelfde ingelogde client, alleen met de extra tabel in de types.
export const urenClient = supabase as unknown as SupabaseClient<UrenDatabase>;
