import type { Metadata } from 'next'

/**
 * Centered SEO and metadata generation helper.
 * Ensures consistent OpenGraph, Twitter cards, etc.
 */
export function generateMetadata(options: {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
}): Metadata {
  const { title, description, keywords, canonicalUrl, ogImage } = options

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
