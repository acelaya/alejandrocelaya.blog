import type { FC, MutableRefObject } from 'react';
import type { ImageProps } from './Image';
import { Image } from './Image';
import { Gallery, Item } from 'react-photoswipe-gallery';

type Dimensions = {
  width?: number;
  height?: number;
};

type Image = ImageProps & Dimensions;

type Images = [Image] | [Image, Image];

type ImageGalleryProps = {
  images: Images;
  modal?: true;
};

export const ImageGallery: FC<ImageGalleryProps> = ({ images, modal }) => {
  return (
    <Gallery withCaption>
      <div className="flex flex-col md:flex-row md:gap-x-5">
        {images.map(({ footerText, url, size, ...dimensions }, index) => (
          <Item key={index} original={url} thumbnail={url} caption={footerText} {...dimensions}>
            {({ ref, open }) => (
              <Image
                ref={ref as MutableRefObject<HTMLDivElement>}
                url={url}
                footerText={footerText}
                size={size ?? (images.length === 1 ? 'big' : 'small')}
                onClick={modal && open}
                centered={images.length === 1}
              />
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  )
}
