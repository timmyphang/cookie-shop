'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/components/CartProvider';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="text-6xl mb-6">&#10003;</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for your order. Your cookies are on the way!
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
