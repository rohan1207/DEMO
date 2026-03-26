export const products = [
  {
    id: 'sage-green',
    slug: 'sage-green',
    name: 'Drip Tumbler - Sage Green',
    shortName: 'Sage Green',
    price: 2499,
    compareAtPrice: 3000,
    rating: 4.8,
    reviewCount: 129,
    description:
      'A premium daily-use tumbler with clean silhouette, food-grade materials, and all-day thermal retention.',
    highlights: [
      '1L total capacity',
      'Flip-top easy-sip lid',
      'Built-in silicone straw',
      'Stable grip base',
      'Leak-resistant carry design',
    ],
    images: ['/product2.png', '/product2.png', '/product2.png', '/product2.png'],
    fallbackImage:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'><rect width='100%25' height='100%25' fill='%23f2f5f1'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23608b58' font-size='52' font-family='Arial'>Sage Green</text></svg>",
  },
  {
    id: 'blush-pink',
    slug: 'blush-pink',
    name: 'Drip Tumbler - Blush Pink',
    shortName: 'Blush Pink',
    price: 2499,
    compareAtPrice: 3000,
    rating: 4.7,
    reviewCount: 98,
    description:
      'A refined lifestyle tumbler in blush finish, engineered for smooth drinking, portability, and reliable insulation.',
    highlights: [
      '1L total capacity',
      'Direct + flip drinking options',
      'Soft-touch carry handle',
      'Noise-reducing base',
      'Premium stainless steel body',
    ],
    images: ['/product1.png', '/product1.png', '/product1.png', '/product1.png'],
    fallbackImage:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'><rect width='100%25' height='100%25' fill='%23f6f1f4'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23956f88' font-size='52' font-family='Arial'>Blush Pink</text></svg>",
  },
];

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug);
