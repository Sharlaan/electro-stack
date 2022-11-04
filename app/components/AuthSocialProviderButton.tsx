import { useOutletContext } from '@remix-run/react';
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { useCallback, useState } from 'react';

import * as SocialIcons from './Icons';
// import * as FaIcons from 'react-icons/fa';
import type { ContextType } from '~/root';
import { capitalize } from '~/utils/capitalize';
import { Button } from './Button';

type Provider =
  | 'apple'
  | 'azure'
  | 'bitbucket'
  | 'discord'
  | 'facebook'
  | 'github'
  | 'gitlab'
  | 'google'
  | 'keycloak'
  | 'linkedin'
  // | 'microsoft'
  | 'notion'
  | 'slack'
  | 'spotify'
  | 'twitch'
  | 'twitter'
  | 'workos';

type Props = {
  provider: Provider;
  returnUrl?: string; // Original page which triggered, and where to come back once logged in
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function AuthSocialProviderButton({ provider, returnUrl = '/profile', ...props }: Props) {
  const { supabaseBrowserClient } = useOutletContext<ContextType>();
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');

  // @ts-ignore
  // const FaIcon = FaIcons[`Fa${capitalize(provider)}`];
  const ProviderIcon = SocialIcons[provider];

  const handleProviderSignIn = useCallback(async () => {
    setIsLoading(true);
    // const redirectTo = `${window.location.origin}/auth/callback?returnUrl=${returnUrl}`;
    try {
      const response = await supabaseBrowserClient?.auth.signInWithOAuth({
        provider,
        // options: { redirectTo },
      });
      console.log(`AuthProviderButton (${provider})`, response);
    } catch (error) {
      console.error(`AuthProviderButton (${provider})`, error);
    } finally {
      setIsLoading(false);
    }
  }, [provider, supabaseBrowserClient]);

  return (
    <Button
      variant="outlined"
      loading={isLoading}
      onClick={handleProviderSignIn}
      disabled={provider !== 'google'}
      {...props}
    >
      {/* <FaIcon size={provider === 'google' ? 18 : 24} /> */}
      <ProviderIcon />
      Continue with {capitalize(provider)}
    </Button>
  );
}
