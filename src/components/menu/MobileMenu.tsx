import type { FC, MouseEventHandler } from 'react';
import { useCallback, useState } from 'react';
import { LeftMenuItems } from './LeftMenuItems';
import { RightMenuItems } from './RightMenuItems';

export const MobileMenu: FC = () => {
  const [visible, setVisible] = useState(false);
  const toggle: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();
    setVisible(prev => !prev);

    // Trigger DOM event for other components to listen
    document.dispatchEvent(new CustomEvent('mobile-menu-toggle', {
      detail: { visible: !visible }
    }));
  }, [visible]);

  return (
    <>
      <a href="#" className={`fh5co-nav-toggle ${visible ? 'active' : ''}`} onClick={toggle}><i /></a>
      <div id="fh5co-offcanvas">
        <ul id="fh5co-side-links">
          <LeftMenuItems />
          <RightMenuItems />
        </ul>
      </div>
    </>
  );
}
