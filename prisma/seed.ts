import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Classic Chocolate Chip',
    description: 'Our signature cookie with generous chunks of dark chocolate. Crispy on the edges, chewy in the middle.',
    price: 480, // $4.80
    category: 'Classic',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
  },
  {
    name: 'Oatmeal Raisin',
    description: 'Hearty oatmeal with plump raisins and a hint of cinnamon. A wholesome classic.',
    price: 420, // $4.20
    category: 'Classic',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
  },
  {
    name: 'Double Chocolate',
    description: 'Rich cocoa cookie loaded with chocolate chips. For the true chocolate lover.',
    price: 520, // $5.20
    category: 'Chocolate',
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcf5?w=400&h=400&fit=crop',
  },
  {
    name: 'Peanut Butter',
    description: 'Creamy peanut butter cookie with a sweet and salty balance. Irresistibly nutty.',
    price: 480, // $4.80
    category: 'Nuts',
    imageUrl: 'https://images.unsplash.com/photo-1597971889618-13f778e4a737?w=400&h=400&fit=crop',
  },
  {
    name: 'White Chocolate Macadamia',
    description: 'Buttery cookie studded with creamy white chocolate and crunchy macadamia nuts.',
    price: 580, // $5.80
    category: 'Premium',
    imageUrl: 'https://images.unsplash.com/photo-1635126724421-4f6e4d1d5c4c?w=400&h=400&fit=crop',
  },
  {
    name: 'Cranberry Almond',
    description: 'Tart dried cranberries with toasted almonds. A delightful fruity and nutty combination.',
    price: 520, // $5.20
    category: 'Premium',
    imageUrl: 'https://images.unsplash.com/photo-1490567674924-0e9567e5e3a3?w=400&h=400&fit=crop',
  },
  {
    name: 'Salted Caramel',
    description: 'Sweet caramel cookie with a hint of sea salt. The perfect sweet and salty treat.',
    price: 550, // $5.50
    category: 'Specialty',
    imageUrl: 'https://images.unsplash.com/photo-1558303156-6b10a2b56a5e?w=400&h=400&fit=crop',
  },
  {
    name: 'Red Velvet',
    description: 'Classic red velvet cookie with white chocolate chips. Elegant and delicious.',
    price: 580, // $5.80
    category: 'Specialty',
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=400&fit=crop',
  },
  {
    name: 'Sticky Date',
    description: 'Traditional date-filled cookie with warm spices. Rich and naturally sweet.',
    price: 480, // $4.80
    category: 'Classic',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
  },
  {
    name: 'Matcha White Chocolate',
    description: 'Japanese-inspired cookie with premium matcha and creamy white chocolate.',
    price: 620, // $6.20
    category: 'Premium',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
  },
];

async function main() {
  console.log('Seeding database...');

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        inStock: true,
      },
    });
    console.log(`Created: ${product.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
