export enum ExampleEnum {
  TYPE_A = 'Type A',
  TYPE_B = 'Type B',
  TYPE_C = 'Type C',
}

export interface ExampleDB {
  id: number;
  name: string;
  property: string | null;
  array_property: string[];
  type: ExampleEnum;
}

/** camelized version of database interface */
export interface Example extends Omit<ExampleDB, 'array_Property'> {
  arrayProperty: string[];
}
