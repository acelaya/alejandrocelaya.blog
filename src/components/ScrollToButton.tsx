import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, MouseEventHandler } from 'react';
import { useCallback } from 'react';

export type ScrollToButtonProps = {
  targetId: string;
};

export const ScrollToButton: FC<ScrollToButtonProps> = ({ targetId }) => {
  const scrollTo: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <a href="#" className="bg-primary text-white hover:text-white p-3 rounded-full mx-auto" onClick={scrollTo}>
      <FontAwesomeIcon icon={faChevronDown} />
    </a>
  );
};
