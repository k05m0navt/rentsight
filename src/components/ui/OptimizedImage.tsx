'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  quality = 75,
  sizes,
  fill = false,
  onLoad,
  onError,
  fallbackSrc = '/placeholder-image.png',
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);

    // Try fallback image if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      onError?.();
    }
  }, [onError, fallbackSrc, currentSrc]);

  // Generate blur data URL if not provided
  const generateBlurDataURL = useCallback((w: number, h: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, w, h);

    return canvas.toDataURL();
  }, []);

  const defaultBlurDataURL =
    blurDataURL || (width && height ? generateBlurDataURL(width, height) : '');

  if (hasError && currentSrc === fallbackSrc) {
    // Show placeholder when both original and fallback fail
    return (
      <div
        className={cn('bg-muted flex items-center justify-center text-muted-foreground', className)}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            'flex items-center justify-center',
          )}
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        quality={quality}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

// Specialized image components for different use cases
export const AvatarImage = ({
  src,
  alt,
  size = 40,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={cn('rounded-full', className)}
    quality={90}
    sizes={`${size}px`}
  />
);

export const ThumbnailImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={150}
    height={150}
    className={cn('rounded-lg object-cover', className)}
    quality={80}
    sizes="150px"
  />
);

export const HeroImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    className={cn('object-cover', className)}
    priority
    quality={85}
    sizes="100vw"
  />
);

export const CardImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={300}
    height={200}
    className={cn('rounded-lg object-cover', className)}
    quality={75}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);

// Image gallery component
export const ImageGallery = ({
  images,
  className,
}: {
  images: Array<{ src: string; alt: string }>;
  className?: string;
}) => (
  <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
    {images.map((image, index) => (
      <ThumbnailImage key={index} src={image.src} alt={image.alt} className="aspect-square" />
    ))}
  </div>
);
