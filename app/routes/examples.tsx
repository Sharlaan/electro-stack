import { Outlet } from '@remix-run/react';
import { ErrorCaughtNotification } from '~/components/errorsBoundaries/ErrorCaughtNotification';

export default function ExamplesIndex() {
  return <Outlet />;
}

export function CatchBoundary() {
  return <ErrorCaughtNotification />;
}
