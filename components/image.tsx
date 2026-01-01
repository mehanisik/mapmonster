import NextImage, { type ImageProps as NextImageProps } from 'next/image'

interface ImageProps extends NextImageProps {
  className?: string
}

/**
 * Custom Image component for standard images.
 * Follows Satus Project Guidelines by wrapping next/image.
 */
export function Image({ className, alt, ...props }: ImageProps) {
  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <NextImage alt={alt} className="object-cover w-full h-full" {...props} />
    </div>
  )
}
