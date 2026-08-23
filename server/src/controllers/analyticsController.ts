import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      orders,
      categories,
      lowStockProducts,
      topProductsRaw
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.findMany({
        where: { status: { not: 'CANCELLED' } },
        include: { items: true }
      }),
      prisma.category.findMany({
        include: { products: { select: { id: true } } }
      }),
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        take: 5,
        select: { id: true, name: true, stock: true, sku: true, price: true }
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 5
      })
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalCustomers > 0 ? Number(((totalOrders / totalCustomers) * 100).toFixed(1)) : 0;

    // Monthly revenue aggregation
    const monthlyRevenueMap: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with 0
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      monthlyRevenueMap[monthLabel] = 0;
    }

    orders.forEach(order => {
      const d = new Date(order.createdAt);
      const monthLabel = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      if (monthlyRevenueMap[monthLabel] !== undefined) {
        monthlyRevenueMap[monthLabel] += order.totalAmount;
      }
    });

    const revenueTrend = Object.keys(monthlyRevenueMap).map(key => ({
      month: key,
      revenue: Math.round(monthlyRevenueMap[key])
    }));

    // Top products with names
    const topProducts = await Promise.all(
      topProductsRaw.map(async item => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          totalUnitsSold: item._sum.quantity || 0,
          totalRevenue: item._sum.totalPrice || 0
        };
      })
    );

    // Recent Audit Logs
    const recentLogs = await prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, role: true } } }
    });

    res.json({
      success: true,
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalCustomers,
        totalProducts,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        conversionRate,
        lowStockCount: lowStockProducts.length
      },
      revenueTrend,
      topProducts,
      lowStockProducts,
      recentAuditLogs: recentLogs
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportAnalyticsReport = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    let csvContent = 'Order Number,Customer Name,Customer Email,Status,Total Amount,Payment Method,Created At\n';
    orders.forEach(o => {
      csvContent += `"${o.orderNumber}","${o.user.name}","${o.user.email}","${o.status}",${o.totalAmount},"${o.paymentMethod}","${o.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=enterprise_sales_report.csv');
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
