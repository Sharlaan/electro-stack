export enum ExampleEnum {
  TYPE_A = 'Type A',
  TYPE_B = 'Type B',
  TYPE_C = 'Type C',
}

export interface ExampleDB {
  id: number;
  name: string;
  property: string | null;
  array_Property: string[];
  type: ExampleEnum;
}

export interface Example extends ExampleDB {
  arrayProperty: string[];
}
