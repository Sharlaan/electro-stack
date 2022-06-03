import { json } from '@remix-run/node';

// export const badRequest = <T>(data: FormActionData<T>) =>
//   json<FormActionData<T>>(data, { status: 400 });
export const badRequest = (data: unknown) => json(data, { status: 400 });

export const unauthorizedResponse = (message?: string) =>
  json(`Unauthorized${message ? ': ' + message : ''}`, { status: 401 });

export const notFoundResponse = () => json(`Page not found`, { status: 404 });

export const errorResponse = (error: unknown) => json(error, { status: 500 });
