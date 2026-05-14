export interface Product {
  name: string;
  slug: string;
  folder: string;
  category: string;
  shortDescription: string;
  images: string[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  products: string[];
}

export const products: Product[] = [
  {
    name: 'Blank Volleyball Jerseys',
    slug: 'blank-volleyball-jerseys',
    folder: 'blank-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: 'High-quality blank volleyball jerseys ready for customization or team use.',
    images: ['/images/blank-volleyball-jerseys/1.jpg', '/images/blank-volleyball-jerseys/2.jpg', '/images/blank-volleyball-jerseys/3.jpg', '/images/blank-volleyball-jerseys/4.jpg', '/images/blank-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'College Volleyball Uniforms',
    slug: 'college-volleyball-uniforms',
    folder: 'college-volleyball-uniforms',
    category: 'volleyball-uniforms',
    shortDescription: 'Premium college volleyball uniforms built for performance and team pride.',
    images: ['/images/college-volleyball-uniforms/1.jpg', '/images/college-volleyball-uniforms/2.jpg', '/images/college-volleyball-uniforms/3.jpg', '/images/college-volleyball-uniforms/4.jpg', '/images/college-volleyball-uniforms/5.jpg'],
  },
  {
    name: 'Custom Name Volleyball Jerseys',
    slug: 'custom-name-volleyball-jerseys',
    folder: 'custom-name-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: 'Personalized volleyball jerseys with custom player names.',
    images: ['/images/custom-name-volleyball-jerseys/1.jpg', '/images/custom-name-volleyball-jerseys/2.jpg', '/images/custom-name-volleyball-jerseys/3.jpg', '/images/custom-name-volleyball-jerseys/4.jpg', '/images/custom-name-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'Custom Number Volleyball Jerseys',
    slug: 'custom-number-volleyball-jerseys',
    folder: 'custom-number-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: 'Custom numbered volleyball jerseys for team identification.',
    images: ['/images/custom-number-volleyball-jerseys/1.jpg', '/images/custom-number-volleyball-jerseys/2.jpg', '/images/custom-number-volleyball-jerseys/3.jpg', '/images/custom-number-volleyball-jerseys/4.jpg', '/images/custom-number-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'High School Volleyball Uniforms',
    slug: 'high-school-volleyball-uniforms',
    folder: 'high-school-volleyball-uniforms',
    category: 'volleyball-uniforms',
    shortDescription: 'Durable and stylish volleyball uniforms for high school teams.',
    images: ['/images/high-school-volleyball-uniforms/1.jpg', '/images/high-school-volleyball-uniforms/2.jpg', '/images/high-school-volleyball-uniforms/3.jpg', '/images/high-school-volleyball-uniforms/4.jpg', '/images/high-school-volleyball-uniforms/5.jpg'],
  },
  {
    name: 'Kids Volleyball Jerseys',
    slug: 'kids-volleyball-jerseys',
    folder: 'kids-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: 'Comfortable, fun volleyball jerseys designed specifically for young players.',
    images: ['/images/kids-volleyball-jerseys/1.jpg', '/images/kids-volleyball-jerseys/2.jpg', '/images/kids-volleyball-jerseys/3.jpg', '/images/kids-volleyball-jerseys/4.jpg', '/images/kids-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'Men Volleyball Jerseys',
    slug: 'men-volleyball-jerseys',
    folder: 'men-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: "Performance volleyball jerseys crafted for men's teams.",
    images: ['/images/men-volleyball-jerseys/1.jpg', '/images/men-volleyball-jerseys/2.jpg', '/images/men-volleyball-jerseys/3.jpg', '/images/men-volleyball-jerseys/4.jpg', '/images/men-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'Men Volleyball Uniforms',
    slug: 'men-volleyball-uniforms',
    folder: 'men-volleyball-uniforms',
    category: 'volleyball-uniforms',
    shortDescription: "Complete men's volleyball uniform sets for leagues and tournaments.",
    images: ['/images/men-volleyball-uniforms/1.jpg', '/images/men-volleyball-uniforms/2.jpg', '/images/men-volleyball-uniforms/3.jpg', '/images/men-volleyball-uniforms/4.jpg', '/images/men-volleyball-uniforms/5.jpg'],
  },
  {
    name: 'Personalized Volleyball Jerseys',
    slug: 'personalized-volleyball-jerseys',
    folder: 'personalized-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: 'Fully personalized volleyball jerseys with names, numbers, and logos.',
    images: ['/images/personalized-volleyball-jerseys/1.jpg', '/images/personalized-volleyball-jerseys/2.jpg', '/images/personalized-volleyball-jerseys/3.jpg', '/images/personalized-volleyball-jerseys/4.jpg', '/images/personalized-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'Sublimated Volleyball Jerseys',
    slug: 'sublimated-volleyball-jerseys',
    folder: 'sublimated-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: 'All-over sublimation printed volleyball jerseys with vibrant, permanent colors.',
    images: ['/images/sublimated-volleyball-jerseys/1.jpg', '/images/sublimated-volleyball-jerseys/2.jpg', '/images/sublimated-volleyball-jerseys/3.jpg', '/images/sublimated-volleyball-jerseys/4.jpg', '/images/sublimated-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'Volleyball Compression Shirts',
    slug: 'volleyball-compression-shirts',
    folder: 'volleyball-compression-shirts',
    category: 'practice-gear',
    shortDescription: 'Performance compression shirts for volleyball training and match play.',
    images: ['/images/volleyball-compression-shirts/1.jpg', '/images/volleyball-compression-shirts/2.jpg', '/images/volleyball-compression-shirts/3.jpg', '/images/volleyball-compression-shirts/4.jpg', '/images/volleyball-compression-shirts/5.jpg'],
  },
  {
    name: 'Volleyball Hoodies',
    slug: 'volleyball-hoodies',
    folder: 'volleyball-hoodies',
    category: 'team-apparel',
    shortDescription: 'Custom volleyball hoodies for team warmups, travel, and off-court style.',
    images: ['/images/volleyball-hoodies/1.jpg', '/images/volleyball-hoodies/2.jpg', '/images/volleyball-hoodies/3.jpg', '/images/volleyball-hoodies/4.jpg', '/images/volleyball-hoodies/5.jpg'],
  },
  {
    name: 'Volleyball Practice Jerseys',
    slug: 'volleyball-practice-jerseys',
    folder: 'volleyball-practice-jerseys',
    category: 'practice-gear',
    shortDescription: 'Durable and breathable practice jerseys for daily volleyball training.',
    images: ['/images/volleyball-practice-jerseys/1.jpg', '/images/volleyball-practice-jerseys/2.jpg', '/images/volleyball-practice-jerseys/3.jpg', '/images/volleyball-practice-jerseys/4.jpg', '/images/volleyball-practice-jerseys/5.jpg'],
  },
  {
    name: 'Volleyball Socks',
    slug: 'volleyball-socks',
    folder: 'volleyball-socks',
    category: 'practice-gear',
    shortDescription: 'Cushioned, performance volleyball socks designed for court grip and comfort.',
    images: ['/images/volleyball-socks/1.jpg', '/images/volleyball-socks/2.jpg', '/images/volleyball-socks/3.jpg', '/images/volleyball-socks/4.jpg', '/images/volleyball-socks/5.jpg'],
  },
  {
    name: 'Volleyball Team Kits',
    slug: 'volleyball-team-kits',
    folder: 'volleyball-team-kits',
    category: 'team-packages',
    shortDescription: 'Complete volleyball team kit packages for clubs, schools, and leagues.',
    images: ['/images/volleyball-team-kits/1.jpg', '/images/volleyball-team-kits/2.jpg', '/images/volleyball-team-kits/3.jpg', '/images/volleyball-team-kits/4.jpg', '/images/volleyball-team-kits/5.jpg'],
  },
  {
    name: 'Volleyball Training Shorts',
    slug: 'volleyball-training-shorts',
    folder: 'volleyball-training-shorts',
    category: 'practice-gear',
    shortDescription: 'Lightweight volleyball training shorts built for freedom of movement.',
    images: ['/images/volleyball-training-shorts/1.jpg', '/images/volleyball-training-shorts/2.jpg', '/images/volleyball-training-shorts/3.jpg', '/images/volleyball-training-shorts/4.jpg', '/images/volleyball-training-shorts/5.jpg'],
  },
  {
    name: 'Volleyball Warm Up Suits',
    slug: 'volleyball-warm-up-suits',
    folder: 'volleyball-warm-up-suits',
    category: 'team-apparel',
    shortDescription: 'Coordinated volleyball warm-up suits for pre-game and travel.',
    images: ['/images/volleyball-warm-up-suits/1.jpg', '/images/volleyball-warm-up-suits/2.jpg', '/images/volleyball-warm-up-suits/3.jpg', '/images/volleyball-warm-up-suits/4.jpg', '/images/volleyball-warm-up-suits/5.jpg'],
  },
  {
    name: 'Women Volleyball Jerseys',
    slug: 'women-volleyball-jerseys',
    folder: 'women-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: "Stylish and performance-driven volleyball jerseys for women's teams.",
    images: ['/images/women-volleyball-jerseys/1.jpg', '/images/women-volleyball-jerseys/2.jpg', '/images/women-volleyball-jerseys/3.jpg', '/images/women-volleyball-jerseys/4.jpg', '/images/women-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'Women Volleyball Uniforms',
    slug: 'women-volleyball-uniforms',
    folder: 'women-volleyball-uniforms',
    category: 'volleyball-uniforms',
    shortDescription: "Complete women's volleyball uniform sets tailored for peak performance.",
    images: ['/images/women-volleyball-uniforms/1.jpg', '/images/women-volleyball-uniforms/2.jpg', '/images/women-volleyball-uniforms/3.jpg', '/images/women-volleyball-uniforms/4.jpg', '/images/women-volleyball-uniforms/5.jpg'],
  },
  {
    name: 'Youth Volleyball Jerseys',
    slug: 'youth-volleyball-jerseys',
    folder: 'youth-volleyball-jerseys',
    category: 'volleyball-jerseys',
    shortDescription: 'Age-appropriate volleyball jerseys for youth leagues and tournaments.',
    images: ['/images/youth-volleyball-jerseys/1.jpg', '/images/youth-volleyball-jerseys/2.jpg', '/images/youth-volleyball-jerseys/3.jpg', '/images/youth-volleyball-jerseys/4.jpg', '/images/youth-volleyball-jerseys/5.jpg'],
  },
  {
    name: 'Youth Volleyball Uniforms',
    slug: 'youth-volleyball-uniforms',
    folder: 'youth-volleyball-uniforms',
    category: 'volleyball-uniforms',
    shortDescription: 'Complete youth volleyball uniform sets for young competitive players.',
    images: ['/images/youth-volleyball-uniforms/1.jpg', '/images/youth-volleyball-uniforms/2.jpg', '/images/youth-volleyball-uniforms/3.jpg', '/images/youth-volleyball-uniforms/4.jpg', '/images/youth-volleyball-uniforms/5.jpg'],
  },
];

export const categories: Category[] = [
  {
    name: 'Volleyball Jerseys',
    slug: 'volleyball-jerseys',
    description: 'Custom and blank volleyball jerseys for youth, adult, men, women, and team orders.',
    products: ['youth-volleyball-jerseys', 'women-volleyball-jerseys', 'men-volleyball-jerseys', 'kids-volleyball-jerseys', 'blank-volleyball-jerseys', 'sublimated-volleyball-jerseys', 'personalized-volleyball-jerseys', 'custom-name-volleyball-jerseys', 'custom-number-volleyball-jerseys'],
  },
  {
    name: 'Volleyball Uniforms',
    slug: 'volleyball-uniforms',
    description: 'Complete volleyball uniform sets for schools, colleges, leagues, and clubs.',
    products: ['youth-volleyball-uniforms', 'women-volleyball-uniforms', 'men-volleyball-uniforms', 'high-school-volleyball-uniforms', 'college-volleyball-uniforms'],
  },
  {
    name: 'Practice Gear',
    slug: 'practice-gear',
    description: 'Durable volleyball practice gear including jerseys, shorts, compression shirts, and socks.',
    products: ['volleyball-practice-jerseys', 'volleyball-compression-shirts', 'volleyball-training-shorts', 'volleyball-socks'],
  },
  {
    name: 'Team Apparel',
    slug: 'team-apparel',
    description: 'Custom team apparel including warm-up suits and hoodies for volleyball teams.',
    products: ['volleyball-warm-up-suits', 'volleyball-hoodies'],
  },
  {
    name: 'Team Packages',
    slug: 'team-packages',
    description: 'Complete volleyball team kit packages with everything your team needs.',
    products: ['volleyball-team-kits'],
  },
];

export const siteConfig = {
  name: 'The Volleyball Uniforms',
  domain: 'thevolleyballuniforms.com',
  url: 'https://thevolleyballuniforms.com',
  email: 'Info@thevolleyballuniforms.com',
  phone: '+1 212-555-0198',
  address: '245 W 29th St, New York, NY 10001, United States',
  description: 'Premium custom volleyball uniforms, jerseys, and team apparel for schools, colleges, clubs, and leagues. Bulk orders welcome.',
};
