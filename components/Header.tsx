import Link from 'next/link';
import { CartButton } from './CartButton';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-amber-600">🍪</span>
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Cookie Shop
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              Products
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}
