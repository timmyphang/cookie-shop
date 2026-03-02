'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
            >
              <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600">{formatPrice(product.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatPrice(product.price * quantity)}
                </p>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'Proceed to Checkout'}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
