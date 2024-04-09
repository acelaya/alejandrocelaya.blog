import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, MouseEventHandler } from 'react';
import { useCallback } from 'react';

export type ScrollToButtonProps = {
  targetId: string;
};

export const ScrollToButton: FC<ScrollToButtonProps> = ({ targetId }) => {
  const scrollTo: MouseEventHandler<SVGElement> = useCallback((e) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <FontAwesomeIcon
      icon={faChevronDown}
      className="bg-primary text-white hover:text-white p-3 rounded-full mx-auto cursor-pointer -mb-2.5"
      onClick={scrollTo}
    />
  );
};
