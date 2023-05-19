import path from 'path';
import imageSize from 'image-size';
import NextImage from 'next/image';
import React from 'react';
import container from '../../../../config/container';

type ImageProps = {
  src: string,
  baseUri: string,
  alt?: string,
  title?: string,
};

type InternalImageProps = Pick<ImageProps, 'src' | 'alt'> & {
  width?: number,
  height?: number,
};

const isExternalOrAbsolute = (src: string): boolean => src.includes('//') || src.startsWith('/');

const getRealImageSrc = (src: string, baseUrl: string) => {
  if (isExternalOrAbsolute(src)) {
    return src;
  }

  return `/${path.join(baseUrl, src).replace(/^\/+/, '')}`;
};

const getImageProps = (src: string, baseUrl: string): { src: string, width?: number, height?: number } => {
  if (isExternalOrAbsolute(src)) {
    return { src };
  }

  const realSrc = getRealImageSrc(src, baseUrl);

  try {
    const contentDir = container.get<string>('params.content_dir');
    const { width, height } = imageSize(path.join(contentDir, realSrc));

    return { width, height, src: realSrc };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return { src: realSrc };
};

const InternalImage: React.FC<InternalImageProps> = ({
  src, alt, width, height,
}) => {
  if (width && height) {
    return (
      <NextImage
        src={ src }
        alt={ alt || '' }
        width={ width }
        height={ height }
        className="mx-auto rounded"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={ src } alt={ alt } className="mx-auto rounded" />
  );
};

const Image: React.FC<ImageProps> = ({
  src, baseUri, alt = '', title,
}) => {
  const imageProps = getImageProps(src, baseUri);
  const ImageComponent = (<InternalImage alt={ alt } { ...imageProps } />);

  if (title) {
    return (
      <figure className="figure">
        { ImageComponent }
        <figcaption className="figure-caption text-center">
          { title }
        </figcaption>
      </figure>
    );
  }

  return ImageComponent;
};

export default Image;
