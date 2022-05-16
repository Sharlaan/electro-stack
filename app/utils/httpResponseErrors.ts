import { json } from '@remix-run/node';

type FormActionData<T> = {
  // Generic message
  formError?: string;
  // Specific messages returned from the validation service
  validationErrorMessages?: Partial<Record<keyof T, string>>;
  // Actual values which triggered error
  fields?: T;
};

export const badRequest = <T>(data: FormActionData<T>) =>
  json<FormActionData<T>>(data, { status: 400 });

export const unauthorizedResponse = () => json('Unauthorized', { status: 401 });

export const notFoundResponse = () => json('Page not found', { status: 404 });

export const errorResponse = (error: unknown) => json(error, { status: 500 });
