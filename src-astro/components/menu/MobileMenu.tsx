import type { FC, MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { LeftMenuItems } from './LeftMenuItems';
import { RightMenuItems } from './RightMenuItems';

interface MobileMenuProps {
  isVisible: boolean;
  toggle: () => void;
}

export const MobileMenu: FC<MobileMenuProps> = ({ toggle, isVisible }) => {
  const doToggle: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();
    toggle();
  }, [toggle]);

  return (
    <>
      <a href="#" className={`fh5co-nav-toggle ${isVisible ? 'active' : ''}`} onClick={doToggle}><i /></a>
      <div id="fh5co-offcanvas">
        <ul id="fh5co-side-links">
          <LeftMenuItems />
          <RightMenuItems />
        </ul>
      </div>
    </>
  );
}
