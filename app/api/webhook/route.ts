import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const sessionWithItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items.data'] }
      );

      const lineItems = sessionWithItems.line_items?.data ?? [];

      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          customerEmail: session.customer_details?.email ?? null,
          amountTotal: session.amount_total ?? 0,
          currency: session.currency ?? 'sgd',
          status: 'completed',
          items: {
            create: lineItems.map((item) => ({
              productName: item.description ?? 'Unknown item',
              unitPrice: item.price?.unit_amount ?? 0,
              quantity: item.quantity ?? 1,
            })),
          },
        },
      });

      console.log(`Order created for session ${session.id}`);
    } catch (err) {
      // Duplicate webhook — unique constraint on stripeSessionId
      if (
        err instanceof Error &&
        err.message.includes('Unique constraint failed')
      ) {
        console.log(`Duplicate webhook for session ${session.id}, skipping`);
        return NextResponse.json({ received: true });
      }

      console.error('Error creating order:', err);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
