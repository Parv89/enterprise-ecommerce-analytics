import { Response } from 'express';
import { prisma } from '../prismaClient';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/emailService';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one product item.' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address details are required.' });
    }

    let calculatedTotal = 0;
    const orderItemsToCreate = [];

    // Verify products and compute totals
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.stock}, requested: ${item.quantity}`
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal
      });

      // Deduct stock
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity }
      });
    }

    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
        status: 'PENDING',
        totalAmount: calculatedTotal,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        paymentMethod: paymentMethod || 'STRIPE',
        paymentStatus: 'PENDING',
        items: {
          create: orderItemsToCreate
        }
      },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } }
      }
    });

    // Send email notification simulation
    await emailService.sendOrderConfirmation(req.user.email, {
      customerName: req.user.name,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items.map(i => ({ name: i.product.name, quantity: i.quantity, unitPrice: i.unitPrice }))
    });

    // Create Notification record
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Order Placed Successfully',
        message: `Your order #${order.orderNumber} for $${order.totalAmount.toFixed(2)} has been submitted.`
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_ORDER',
        entity: 'Order',
        details: JSON.stringify({ orderId: order.id, orderNumber: order.orderNumber, total: order.totalAmount })
      }
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: true } },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) {
      where.status = status as string;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string } },
        { user: { name: { contains: search as string } } },
        { user: { email: { contains: search as string } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } },
          payments: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { product: true } },
        payments: true
      }
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Check ownership if not admin/manager
    if (req.user?.role === 'CUSTOMER' && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied to this order.' });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined
      },
      include: { user: true }
    });

    // Notify user
    await emailService.sendStatusUpdate(order.user.email, order.orderNumber, status, trackingNumber);

    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: `Order #${order.orderNumber} Status Updated`,
        message: `Your order status changed to: ${status}${trackingNumber ? ` (Tracking #: ${trackingNumber})` : ''}`
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_ORDER_STATUS',
        entity: 'Order',
        details: JSON.stringify({ orderId: id, newStatus: status, trackingNumber })
      }
    });

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
