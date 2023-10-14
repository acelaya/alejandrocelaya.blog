import type { FC } from 'react';

export interface ImageProps {
  url: string;
  footerText: string;
  size?: 'small' | 'big';
  centered?: boolean;
  onClick?: () => void;
}

export const Image: FC<ImageProps> = ({ url, footerText, size = 'small', centered = false, onClick }) => (
  <div className={`${size === 'big' ? 'col-md-8' : 'col-md-6'} ${centered && size === 'big' ? 'col-md-offset-2' : ''} ${centered && size === 'small' ? 'col-md-offset-3' : ''}`}>
    <img alt={footerText} src={url} className={onClick ? 'gallery-item' : ''} onClick={onClick} />
    <p className="text-center"><small>{footerText}</small></p>
  </div>
)
