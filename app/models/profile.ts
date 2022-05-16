export interface ProfileDB {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Profile extends ProfileDB {
  firstName: string;
  lastName: string;
}
