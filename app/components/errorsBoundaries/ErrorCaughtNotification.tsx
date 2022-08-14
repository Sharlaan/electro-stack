import { useCatch, useNavigate } from '@remix-run/react';
import { useUpdateEffect } from 'react-use';
import { useCountDown } from '~/utils/useCountDown';

const DURATION = 3; // seconds

/** Use in CatchBoundary for client-side errors */
export function ErrorCaughtNotification() {
  const navigate = useNavigate();
  const remainingTime = useCountDown(DURATION);
  let { data, status, statusText } = useCatch();

  let redirectUrl = '/';
  if (status === 401) {
    statusText ||= 'Unauthorized';
    if (!data?.message) data = 'You must be authentified to access this page.';
    redirectUrl = '/auth/login';
  } else if (status === 404) {
    statusText ||= 'Page not found';
  }

  useUpdateEffect(() => {
    !remainingTime && navigate(redirectUrl);
  }, [remainingTime]);

  return (
    <section className="error">
      <h2>
        {statusText} ({status})
      </h2>
      {!data?.message ? null : <p>{data.message || data}</p>}
      Redirecting in {remainingTime} seconds.
    </section>
  );
}
