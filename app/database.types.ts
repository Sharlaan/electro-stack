type JsonValue = string | number | boolean | null | Record<string, Json>;
export interface Json extends Array<JsonValue> {}

export interface Database {
  public: {
    Tables: {
      examples: {
        Row: {
          updated_at: string | null;
          name: string;
          property: string | null;
          type: Database['public']['Enums']['example_type'];
          created_at: string | null;
          id: number;
          array_property: string[] | null;
          user_id: string | null;
        };
        Insert: {
          updated_at?: string | null;
          name: string;
          property?: string | null;
          type: Database['public']['Enums']['example_type'];
          created_at?: string | null;
          id?: number;
          array_property?: string[] | null;
          user_id?: string | null;
        };
        Update: {
          updated_at?: string | null;
          name?: string;
          property?: string | null;
          type?: Database['public']['Enums']['example_type'];
          created_at?: string | null;
          id?: number;
          array_property?: string[] | null;
          user_id?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      example_type: 'Type A' | 'Type B' | 'Type C';
    };
  };
}
