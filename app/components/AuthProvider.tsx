import type { SupabaseClient } from '@supabase/supabase-js';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import { supabaseClient } from '../services/supabase/supabase.client';

export const AuthContext = createContext<SupabaseClient | null>(null);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <AuthContext.Provider value={supabaseClient}>{children}</AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
