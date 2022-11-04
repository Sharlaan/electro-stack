// import type { Profile } from '~/models';
// import { snakeToCamelObject } from '~/utils/snakeCamelConverters';
// import { supabaseServer } from './supabase/supabase.server';

// export async function getProfile(): Promise<Profile | null> {
//   const { data, error } = await supabaseServer.from('profiles').select().single();
//   if (error || !data) return null;
//   return snakeToCamelObject(data) as unknown as Profile;
// }

// export async function createProfile(profile: Profile): Promise<boolean> {
//   const createProfile = await supabaseServer.from('profiles').insert(profile);
//   return !createProfile.error;
// }

export {};
