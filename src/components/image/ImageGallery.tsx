import type { FC } from 'react';
import { useMemo, useState } from 'react';
import Lightbox from 'react-18-image-lightbox';
import type { ImageProps } from './Image';
import { Image } from './Image';

type Images = [ImageProps] | [ImageProps, ImageProps];

export const ImageGallery: FC<{ images: Images, modal?: boolean }> = ({ images, modal }) => {
  const [isOpen, openModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const nextIndex = useMemo(() => activeIndex + 1, [activeIndex]);
  const prevIndex = useMemo(() => activeIndex - 1, [activeIndex]);

  return (
    <>
      <div className="row">
        {images.map(({ footerText, url, size, centered }, index) => (
          <Image
            key={index}
            url={url}
            footerText={footerText}
            size={size ?? (images.length === 1 ? 'big' : 'small')}
            centered={centered ?? images.length === 1}
            onClick={modal ? () => {
              setActiveIndex(index);
              openModal(true);
            } : undefined}
          />
        ))}
      </div>
      {modal && isOpen && (
        <Lightbox
          mainSrc={images[activeIndex].url}
          nextSrc={images[nextIndex]?.url}
          prevSrc={images[prevIndex]?.url}
          onCloseRequest={() => openModal(false)}
          onMoveNextRequest={() => setActiveIndex((prev) => prev + 1)}
          onMovePrevRequest={() => setActiveIndex((prev) => prev - 1)}
        />
      )}
    </>
  )
}
