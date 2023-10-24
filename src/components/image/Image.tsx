import { clsx } from 'clsx';
import type { MouseEventHandler } from 'react';
import { forwardRef } from 'react';

export interface ImageProps {
  url: string;
  footerText: string;
  size?: 'small' | 'big';
  onClick?: MouseEventHandler;
}

export const Image = forwardRef<HTMLDivElement, ImageProps>(
  ({ url, footerText, size = 'small', onClick }, ref) => (
    <div
      ref={ref}
      className={clsx({
        'w-2/3': size === 'big',
        'w-1/2': size === 'small',
      })}
    >
      <img alt={footerText} src={url} className={clsx({ 'cursor-zoom-in': onClick })} onClick={onClick} />
      <p className="text-center"><small>{footerText}</small></p>
    </div>
  ),
);
