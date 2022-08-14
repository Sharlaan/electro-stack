import { Link } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react';
import { useRef, useState } from 'react';
import { MdLogout, MdPerson, MdSettings } from 'react-icons/md';
import { useKeyboardNavigationInList } from '~/utils/useKeyboardNavigationInList';
import { Button } from './Button';

export function HeaderMenu({ user }: { user: User }) {
  const menuRef = useRef<HTMLUListElement | null>(null);
  useKeyboardNavigationInList(menuRef);

  const [isOpen, setIsOpen] = useState(false);
  const handleBlur = () => setIsOpen(false);
  const handleFocus = () => setIsOpen(true);

  const closeMenuAfterOptionClick = ({ target }: MouseEvent) =>
    ['A', 'BUTTON'].includes((target as HTMLElement).nodeName) && (target as HTMLElement).blur();

  const closeMenuWithEscapeKey = ({ key, target }: ReactKeyboardEvent) =>
    key === 'Escape' && (target as HTMLElement).blur();

  // Sets focus on the first option
  // useUpdateEffect(() => {
  //   const menu = menuRef.current;
  //   if (isOpen) {
  //     const firstOption = menu?.firstChild as HTMLLIElement | null;
  //     const firstFocusable =
  //       firstOption?.querySelector<HTMLAnchorElement | HTMLButtonElement>('a, button') || null;
  //     firstFocusable?.focus();
  //   }
  // }, [isOpen]);

  return (
    <span
      className="header-menu"
      aria-haspopup
      aria-expanded={isOpen}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyUp={closeMenuWithEscapeKey}
    >
      <Button title="Open for more actions">
        {user?.user_metadata?.avatar ? (
          <img src={user.user_metadata.avatar} alt="avatar icon menu" />
        ) : (
          user.user_metadata.name[0].toUpperCase()
        )}
      </Button>

      <ul ref={menuRef} onClick={closeMenuAfterOptionClick}>
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
