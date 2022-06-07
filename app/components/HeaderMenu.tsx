import { Link } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useState } from 'react';
import { MdLogout, MdPerson, MdSettings } from 'react-icons/md';
import { Button } from './Button';

export function HeaderMenu({ user }: { user: User }) {
  const [ariaExpanded, setAriaExpanded] = useState(false);
  const handleFocus = () => setAriaExpanded(true);
  const handleBlur = () => setAriaExpanded(false);

  const closeMenuWithEscapeKey = ({ code, target }: KeyboardEvent) =>
    target instanceof HTMLSpanElement && code === 'Escape' && target.blur();

  const closeMenu = ({ target }: MouseEvent) =>
    target instanceof HTMLAnchorElement && target.blur();

  return (
    <span
      className="header-menu"
      aria-haspopup
      aria-expanded={ariaExpanded}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyUp={closeMenuWithEscapeKey}
    >
      <Button type="button" title="Open for more actions">
        {user?.user_metadata?.avatar ? (
          <img src={user.user_metadata.avatar} alt="avatar icon menu" />
        ) : (
          user.user_metadata.name[0].toUpperCase()
        )}
      </Button>

      <ul onClick={closeMenu}>
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
    </span>
  );
}
