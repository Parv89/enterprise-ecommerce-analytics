import Stripe from 'stripe';

class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key && !key.includes('mock')) {
      this.stripe = new Stripe(key, { apiVersion: '2023-10-16' });
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata: Record<string, string> = {}) {
    const amountInCents = Math.round(amount * 100);

    if (this.stripe) {
      const intent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        metadata
      });
      return {
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        status: intent.status
      };
    }

    // Mock Stripe response for testing without live API keys
    const mockIntentId = `pi_mock_${Math.random().toString(36).substring(2, 10)}`;
    return {
      clientSecret: `${mockIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`,
      paymentIntentId: mockIntentId,
      status: 'succeeded'
    };
  }
}

export const stripeService = new StripeService();
