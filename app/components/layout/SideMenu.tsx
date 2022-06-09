import { NavLink } from '@remix-run/react';

export function SideMenu() {
  return (
    <aside>
      <h2>Navigation</h2>

      <nav>
        <NavLink to="/examples">Examples Section</NavLink>
        <NavLink to="/toto">Tatas Section</NavLink>
        <NavLink to="/tata">Titis Section</NavLink>
        <NavLink to="/titi">Totos Section</NavLink>
      </nav>
    </aside>
  );
}
