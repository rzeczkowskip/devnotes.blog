import path from 'path';
import imageSize from 'image-size';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import React from 'react';
import container from '../../../config/container';

type ContentImageProps = NextImageProps & {
  src: string,
  baseUri: string,
  title?: string,
};

type InternalImageProps = Omit<ContentImageProps, 'baseUri' | 'title'>;

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
  src,
  alt,
  className,
  width,
  height,
  ...props
}) => {
  if (width && height) {
    return (
      <NextImage
        src={ src }
        alt={ alt || '' }
        width={ width }
        height={ height }
        className={ className }
        { ...props }
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={ src } alt={ alt } className={ className } />
  );
};

const ContentImage: React.FC<ContentImageProps> = ({
  src,
  baseUri,
  title,
  ...props
}) => {
  const imageProps = getImageProps(src, baseUri);

  const ImageComponent = (
    <InternalImage
      { ...{ ...props, ...imageProps } }
    />
  );

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

export default ContentImage;
