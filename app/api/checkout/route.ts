import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

type CartItem = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'paynow'],
      allow_promotion_codes: true,
      line_items: items.map((item) => ({
        price_data: {
          currency: 'sgd',
          product_data: {
            name: item.product.name,
            ...(item.product.imageUrl && { images: [item.product.imageUrl] }),
          },
          unit_amount: item.product.price,
        },
        quantity: item.quantity,
      })),
      metadata: {
        itemCount: String(items.length),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
