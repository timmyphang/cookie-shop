import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fresh Cookies in Singapore
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Delivering homemade-style cookies straight to your door. Made fresh
          daily with quality ingredients.
        </p>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products available at the moment. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
