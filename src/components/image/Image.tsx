import type { MouseEventHandler } from 'react';
import { forwardRef } from 'react';

export interface ImageProps {
  url: string;
  footerText: string;
  size?: 'small' | 'big';
  centered?: boolean;
  onClick?: MouseEventHandler;
}

const resolveClasses = ({ size, centered }: Required<Pick<ImageProps, 'size' | 'centered'>>): string => {
  const classes = [size === 'big' ? 'col-md-8' : 'col-md-6'];

  if (centered && size === 'big') {
    classes.push('col-md-offset-2');
  }

  if (centered && size === 'small') {
    classes.push('col-md-offset-3');
  }

  return classes.join(' ');
};

export const Image = forwardRef<HTMLDivElement, ImageProps>(
  ({ url, footerText, size = 'small', centered = false, onClick }, ref) => (
    <div ref={ref} className={resolveClasses({ size, centered })}>
      <img alt={footerText} src={url} className={onClick && 'gallery-item'} onClick={onClick} />
      <p className="text-center"><small>{footerText}</small></p>
    </div>
  ),
);
