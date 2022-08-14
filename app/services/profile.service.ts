import type { Profile, ProfileDB } from '~/models';
import { snakeToCamelObject } from '~/utils/snakeCamelConverters';
import { supabaseServer } from './supabase/supabase.server';

export const getProfile = async (): Promise<Profile | null> => {
  const { data, error } = await supabaseServer.from<ProfileDB>('profiles').select().single();
  if (error || !data) return null;
  return snakeToCamelObject(data) as unknown as Profile;
};

export const createProfile = async (profile: Profile): Promise<boolean> => {
  const createProfile = await supabaseServer.from<ProfileDB>('profiles').insert(profile);
  return !createProfile.error;
};
