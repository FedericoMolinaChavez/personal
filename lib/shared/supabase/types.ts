// Placeholder Supabase types.
//
// Regenerate the full, accurate types from the live schema with:
//   npm run db:types     (requires `npm run db:start` — local stack running)
//
// Until then this hand-written stub covers the public.project_metadata table
// the marketing site reads, and keeps the typed clients compiling. The generated
// file will replace this entirely with all schemas (public/agronomy/spray/fields).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      project_metadata: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          img: string | null;
          link: string | null;
          video: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          img?: string | null;
          link?: string | null;
          video?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          img?: string | null;
          link?: string | null;
          video?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
