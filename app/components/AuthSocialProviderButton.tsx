import type { Provider } from '@supabase/supabase-js';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { useCallback } from 'react';
import * as FaIcons from 'react-icons/fa';
import { supabaseClient } from '~/services/supabase/supabase.client';
import { capitalize } from '~/utils/capitalize';
import { Button } from './Button';

type Props = {
  provider: Provider;
  returnUrl?: string; // Original page which triggered, and where to come back once logged in
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function AuthSocialProviderButton({ provider, returnUrl = '/profile', ...props }: Props) {
  const onClick = useCallback(async () => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback?returnUrl=${returnUrl}`;
      const response = await supabaseClient.auth.signIn({ provider }, { redirectTo });
      console.log('AuthProviderButton', response);
    } catch (error) {
      console.error('AuthProviderButton', error);
      return;
    }
  }, [provider, returnUrl]);

  // @ts-ignore
  const FaIcon = FaIcons[`Fa${capitalize(provider)}`];

  return (
    <Button
      type="button"
      variant="outlined"
      onClick={onClick}
      disabled={provider !== 'google'}
      {...props}
    >
      <FaIcon size={provider === 'google' ? 18 : 24} />
      Continue with {capitalize(provider)}
    </Button>
  );
}
