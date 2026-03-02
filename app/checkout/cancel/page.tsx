'use client';

import Link from 'next/link';

export default function CheckoutCancel() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="text-6xl mb-6">&#8592;</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Checkout Cancelled
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Your cart is still saved. Come back when you&apos;re ready!
        </p>
        <Link
          href="/cart"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
