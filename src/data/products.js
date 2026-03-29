export const products = [
  {
    id: 'sage-green',
    slug: 'sage-green',
    name: 'T-REX Tumbler - Sage Green',
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
    detailSections: [
      {
        title: 'Precision-built body',
        description:
          'Double-wall stainless steel with clean contouring keeps the profile minimal while preserving temperature through long desk days and commutes.',
        image: '/product2.png',
      },
      {
        title: 'Comfort-first carry geometry',
        description:
          'The handle and lid relationship is tuned for secure grip transitions, so moving from bag to hand feels balanced and natural.',
        image: '/middle.png',
      },
      {
        title: 'Quiet premium finishing',
        description:
          'Soft matte treatment, measured proportions, and low-noise base contact are designed to look refined in every setting.',
        image: '/middle.png',
      },
    ],
    heroImage: '/product2.png',
    galleryImages: ['/product2.png', '/product2.png', '/product2.png'],
  },
  {
    id: 'blush-pink',
    slug: 'blush-pink',
    name: 'T-REX Tumbler - Blush Pink',
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
    detailSections: [
      {
        title: 'Refined silhouette',
        description:
          'A blush-toned finish with clean vertical proportions gives the tumbler a premium, understated presence on desk, commute, and travel setups.',
        image: '/product1.png',
      },
      {
        title: 'Engineered everyday usability',
        description:
          'From lid action to straw path, each interaction is streamlined for repeat daily use without friction, spills, or unnecessary complexity.',
        image: '/middle.png',
      },
      {
        title: 'Durability without bulk',
        description:
          'Structural confidence, balanced weight, and scratch-conscious surfaces provide long-term reliability while maintaining a sleek profile.',
        image: '/middle.png',
      },
    ],
    heroImage: '/product1.png',
    galleryImages: ['/product1.png', '/product1.png', '/product1.png'],
  },
];

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug);
