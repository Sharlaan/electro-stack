import type { LoaderFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { ErrorCaughtNotification } from '~/components/errorsBoundaries/ErrorCaughtNotification';
import { isAuthenticated } from '~/services/auth.service.server';
import { unauthorizedResponse } from '~/utils/httpResponseErrors';

/** This check should protect the whole routes sub-tree */
export const loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) throw unauthorizedResponse();
  return null;
};

export default function ExamplesIndex() {
  return <Outlet />;
}

export function CatchBoundary() {
  return <ErrorCaughtNotification />;
}
