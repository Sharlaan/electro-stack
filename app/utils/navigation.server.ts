import { redirect } from '@remix-run/node';

export const redirectToLoginPage = (request: Request) => {
  const returnUrl = makeReturnUrl(request);
  return redirect(`/auth/login${returnUrl ? `?${returnUrl}` : ''}`);
};

export const getCurrentPath = (request: Request) => {
  return new URL(request.url).pathname;
};

export const makeReturnUrl = (request: Request) => {
  return new URLSearchParams([['returnUrl', getCurrentPath(request)]]);
};

export const getReturnUrl = (request: Request) => {
  const url = new URL(request.url);
  return url.searchParams.get('returnUrl');
};
