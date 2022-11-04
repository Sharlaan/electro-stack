import { NavLink, useNavigate } from '@remix-run/react';
import { MdLogin, MdLogout, MdPerson, MdPersonAdd, MdSettings } from 'react-icons/md';

import type { ContextType } from '~/root';
import { Button } from '../Button';

export function SideMenu({ context }: { context: ContextType }) {
  const { session, supabaseBrowserClient } = context;
  const navigate = useNavigate();

  return (
    <aside>
      <h2>
        <NavLink to="/">TITLE</NavLink>
      </h2>

      <nav>
        <NavLink to="/examples">Examples Section</NavLink>
        <NavLink to="/tatas">Tatas Section</NavLink>
        <NavLink to="/titis">Titis Section</NavLink>
        <NavLink to="/totos">Totos Section</NavLink>
      </nav>

      <div className="spacer"></div>

      <nav>
        {session?.user ? (
          <>
            <NavLink to="/profile">
              <MdPerson />
              Profile
            </NavLink>
            <NavLink to="/settings">
              <MdSettings />
              Settings
            </NavLink>
            <hr />
            <Button
              variant="flat"
              onClick={async () => {
                await supabaseBrowserClient?.auth.signOut();
                navigate('/auth/login');
              }}
            >
              <MdLogout />
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/auth/login">
              <MdLogin />
              LOGIN
            </NavLink>
            <NavLink to="/auth/register">
              <MdPersonAdd />
              REGISTER
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
