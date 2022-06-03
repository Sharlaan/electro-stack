import { Link } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { MdLogout, MdPerson, MdSettings } from 'react-icons/md';
import { Button } from './Button';

export function HeaderMenu({ user }: { user: User }) {
  return (
    <div className="header-menu">
      {user?.user_metadata?.avatar ? (
        <img src={user.user_metadata.avatar} alt="avatar icon menu" />
      ) : (
        <div>{user.user_metadata.name[0].toUpperCase()}</div>
      )}

      <ul>
        <li>
          <Link to="/profile">
            <MdPerson />
            Profile
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <MdSettings />
            Settings
          </Link>
        </li>
        <li>
          <hr />
        </li>
        <li>
          <form method="post">
            <Button>
              <MdLogout />
              Logout
            </Button>
          </form>
        </li>
      </ul>
    </div>
  );
}
