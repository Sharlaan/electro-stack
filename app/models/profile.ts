export interface ProfileDB {
  id: string;
  first_name: string;
  last_name: string;
}

/** camelized version of database interface */
export interface Profile extends Omit<ProfileDB, 'first_name' | 'last_name'> {
  firstName: string;
  lastName: string;
}
