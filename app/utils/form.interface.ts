export type FormActionData<T> = {
  formError?: string;
  fieldErrors?: Partial<T>;
  fields?: T;
};
