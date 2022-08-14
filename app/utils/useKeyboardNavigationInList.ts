import type { MutableRefObject } from 'react';
import { useKeyPressEvent } from 'react-use';

export function useKeyboardNavigationInList(
  listElementRef: MutableRefObject<HTMLUListElement | null>
) {
  const navigateInList =
    (direction: 'up' | 'down') =>
    ({ target }: KeyboardEvent) => {
      const menu = listElementRef.current;
      if (!menu?.children.length || !target) return;
      const isActiveItemInMenu = menu.contains(document.activeElement);
      if (!isActiveItemInMenu) return;
      const currentOption = target as HTMLAnchorElement | HTMLButtonElement;
      const focusableChildren = Array.from(menu.children).reduce<
        (HTMLAnchorElement | HTMLButtonElement)[]
      >((r, node) => {
        const focusable = node?.querySelector<HTMLAnchorElement | HTMLButtonElement>('a, button');
        return focusable ? r.concat(focusable) : r;
      }, []);
      if (!focusableChildren.length) return;

      const firstOption = focusableChildren[0];
      const lastOption = focusableChildren.at(-1) as HTMLAnchorElement | HTMLButtonElement;
      const currentIndex = focusableChildren.indexOf(currentOption);

      let optionToFocus: HTMLAnchorElement | HTMLButtonElement | null = null;
      if (direction === 'up') {
        optionToFocus =
          currentIndex === 0 ? lastOption : focusableChildren.at(currentIndex - 1) || null;
      } else {
        optionToFocus =
          currentIndex === focusableChildren.length - 1
            ? firstOption
            : focusableChildren.at(currentIndex + 1) || null;
      }
      optionToFocus?.focus();
    };

  useKeyPressEvent(({ key }) => ['ArrowDown', 'Tab'].includes(key), null, navigateInList('down'));
  useKeyPressEvent(
    ({ key, shiftKey }) => key === 'ArrowUp' || (shiftKey && key === 'Tab'),
    null,
    navigateInList('up')
  );
}
