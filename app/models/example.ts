import type { Database } from '~/database.types';

export type ExampleTypes = Database['public']['Enums']['example_type'];

export interface ExampleDB {
  id: number;
  name: string;
  property: string | null;
  array_property: string[];
  type: ExampleTypes;
}

/** camelized version of database interface */
export interface Example extends Omit<ExampleDB, 'array_Property'> {
  arrayProperty: string[];
}
