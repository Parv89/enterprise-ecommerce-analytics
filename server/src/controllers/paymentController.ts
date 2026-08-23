import { Response } from 'express';
import { prisma } from '../prismaClient';
import { AuthRequest } from '../middleware/auth';
import { stripeService } from '../services/stripeService';

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const paymentResult = await stripeService.createPaymentIntent(order.totalAmount, 'usd', {
      orderId: order.id,
      orderNumber: order.orderNumber
    });

    res.json({
      success: true,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      amount: order.totalAmount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Save payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        transactionId: paymentIntentId || `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        amount: order.totalAmount,
        status: 'SUCCEEDED',
        provider: 'STRIPE',
        details: JSON.stringify({ verifiedAt: new Date().toISOString() })
      }
    });

    // Update order status to PAID
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paymentStatus: 'COMPLETED'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CONFIRM_PAYMENT',
        entity: 'Payment',
        details: JSON.stringify({ orderId: order.id, transactionId: payment.transactionId, amount: payment.amount })
      }
    });

    res.json({ success: true, payment, order: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
