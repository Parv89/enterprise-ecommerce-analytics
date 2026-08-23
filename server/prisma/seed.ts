import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise E-Commerce database seeding...');

  // 1. Clear existing data
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.fileStorage.deleteMany();

  // 2. Create Users
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const managerPassword = await bcrypt.hash('Manager@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@enterprise.com',
      password: adminPassword,
      name: 'Alexander Pierce (Chief Admin)',
      role: 'ADMIN',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@enterprise.com',
      password: managerPassword,
      name: 'Sarah Jenkins (Operations Manager)',
      role: 'MANAGER',
      phone: '+1 (555) 018-9921',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    }
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'customer@enterprise.com',
      password: customerPassword,
      name: 'David Vance',
      role: 'CUSTOMER',
      phone: '+1 (555) 012-3456',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'elena.rodriguez@example.com',
      password: customerPassword,
      name: 'Elena Rodriguez',
      role: 'CUSTOMER',
      phone: '+1 (555) 014-7788'
    }
  });

  console.log('✅ Users seeded (Admin: admin@enterprise.com / Admin@123, Manager: manager@enterprise.com / Manager@123, Customer: customer@enterprise.com / Customer@123)');

  // 3. Create Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: 'Electronics & Gadgets',
      slug: 'electronics',
      description: 'High-performance laptops, smartphones, and pro gear.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    }
  });

  const catAudio = await prisma.category.create({
    data: {
      name: 'Audio & Acoustics',
      slug: 'audio',
      description: 'Studio headphones, spatial audio speakers, and noise-canceling headsets.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'
    }
  });

  const catWearables = await prisma.category.create({
    data: {
      name: 'Smart Wearables',
      slug: 'wearables',
      description: 'Fitness trackers, luxury smartwatches, and biometric devices.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
    }
  });

  const catHome = await prisma.category.create({
    data: {
      name: 'Smart Office & Home',
      slug: 'home-office',
      description: 'Ergonomic desks, ambient illumination, and smart automation.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500'
    }
  });

  console.log('✅ Categories seeded');

  // 4. Create Products
  const productsData = [
    {
      name: 'ApexPro M3 M3-Max Workstation Laptop',
      slug: 'apexpro-m3-workstation',
      description: 'Next-generation 16-inch computing power with 64GB Unified Memory, 2TB Ultra-fast NVMe SSD, and 120Hz Liquid Retina display.',
      price: 2499.99,
      compareAtPrice: 2799.99,
      stock: 45,
      sku: 'APX-M3-001',
      categoryId: catElectronics.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
      ]),
      isFeatured: true,
      ratingsAvg: 4.9,
      ratingsCount: 128
    },
    {
      name: 'AcousticMax Horizon Noise-Canceling Headphones',
      slug: 'acousticmax-horizon-headphones',
      description: 'Active ANC with spatial audio streaming, 40-hour battery stamina, ultra-plush memory foam, and studio flat response curve.',
      price: 349.99,
      compareAtPrice: 399.99,
      stock: 120,
      sku: 'AUD-NC-900',
      categoryId: catAudio.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
      ]),
      isFeatured: true,
      ratingsAvg: 4.8,
      ratingsCount: 94
    },
    {
      name: 'ChronoTech Ultra Titanium Smartwatch',
      slug: 'chronotech-ultra-titanium',
      description: 'Aerospace grade titanium casing, Sapphire Glass OLED, dual-frequency GPS, ECG monitor, and 100m water depth rating.',
      price: 799.00,
      compareAtPrice: 899.00,
      stock: 8, // Low stock for dashboard testing
      sku: 'WRB-TITAN-05',
      categoryId: catWearables.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
      ]),
      isFeatured: true,
      ratingsAvg: 4.7,
      ratingsCount: 65
    },
    {
      name: 'ErgoMotion Smart Standing Desk Pro',
      slug: 'ergomotion-smart-standing-desk',
      description: 'Dual electric motors, solid walnut top, anti-collision sensor, programmable memory presets, and integrated cable concealment system.',
      price: 899.50,
      compareAtPrice: 1049.00,
      stock: 18,
      sku: 'DESK-ERG-01',
      categoryId: catHome.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'
      ]),
      isFeatured: false,
      ratingsAvg: 4.9,
      ratingsCount: 42
    },
    {
      name: 'OmniCam 4K Cinematic Mirrorless Camera',
      slug: 'omnicam-4k-cinematic',
      description: 'Full-frame sensor with 4K 120fps recording capability, 5-axis IBIS, dual UHS-II slots, and real-time eye tracking autofocus.',
      price: 1899.00,
      compareAtPrice: 2099.00,
      stock: 3, // Low stock alert trigger
      sku: 'CAM-4K-990',
      categoryId: catElectronics.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
      ]),
      isFeatured: true,
      ratingsAvg: 4.9,
      ratingsCount: 88
    },
    {
      name: 'PulseSound Studio Reference Monitors (Pair)',
      slug: 'pulsesound-studio-monitors',
      description: 'Bi-amplified 8-inch studio reference speakers with custom Kevlar woofers and silk dome tweeters for acoustic precision.',
      price: 599.99,
      compareAtPrice: 699.99,
      stock: 32,
      sku: 'AUD-MON-808',
      categoryId: catAudio.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800'
      ]),
      isFeatured: false,
      ratingsAvg: 4.6,
      ratingsCount: 31
    }
  ];

  const createdProducts = [];
  for (const prodData of productsData) {
    const p = await prisma.product.create({ data: prodData });
    createdProducts.push(p);
  }

  console.log('✅ Products seeded');

  // 5. Create Historical Orders across last 6 months for Realistic Analytics
  const now = new Date();
  const sampleOrders = [
    {
      orderNumber: 'ORD-2026-1001',
      userId: customer1.id,
      status: 'DELIVERED',
      totalAmount: 2849.98,
      shippingAddress: JSON.stringify({ street: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', zip: '97477', country: 'USA' }),
      paymentMethod: 'STRIPE',
      paymentStatus: 'COMPLETED',
      createdAt: new Date(now.getFullYear(), now.getMonth() - 4, 12),
      items: [
        { productId: createdProducts[0].id, quantity: 1, unitPrice: 2499.99, totalPrice: 2499.99 },
        { productId: createdProducts[1].id, quantity: 1, unitPrice: 349.99, totalPrice: 349.99 }
      ]
    },
    {
      orderNumber: 'ORD-2026-1002',
      userId: customer2.id,
      status: 'SHIPPED',
      totalAmount: 1598.00,
      shippingAddress: JSON.stringify({ street: '100 Ocean Drive', city: 'Miami', state: 'FL', zip: '33139', country: 'USA' }),
      paymentMethod: 'STRIPE',
      paymentStatus: 'COMPLETED',
      createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 20),
      items: [
        { productId: createdProducts[2].id, quantity: 2, unitPrice: 799.00, totalPrice: 1598.00 }
      ]
    },
    {
      orderNumber: 'ORD-2026-1003',
      userId: customer1.id,
      status: 'PROCESSING',
      totalAmount: 1899.00,
      shippingAddress: JSON.stringify({ street: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', zip: '97477', country: 'USA' }),
      paymentMethod: 'STRIPE',
      paymentStatus: 'COMPLETED',
      createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 5),
      items: [
        { productId: createdProducts[4].id, quantity: 1, unitPrice: 1899.00, totalPrice: 1899.00 }
      ]
    },
    {
      orderNumber: 'ORD-2026-1004',
      userId: customer2.id,
      status: 'PAID',
      totalAmount: 899.50,
      shippingAddress: JSON.stringify({ street: '100 Ocean Drive', city: 'Miami', state: 'FL', zip: '33139', country: 'USA' }),
      paymentMethod: 'STRIPE',
      paymentStatus: 'COMPLETED',
      createdAt: new Date(now.getFullYear(), now.getMonth(), 2),
      items: [
        { productId: createdProducts[3].id, quantity: 1, unitPrice: 899.50, totalPrice: 899.50 }
      ]
    }
  ];

  for (const ord of sampleOrders) {
    const { items, ...orderInfo } = ord;
    const createdOrder = await prisma.order.create({
      data: {
        ...orderInfo,
        items: {
          create: items
        }
      }
    });

    await prisma.payment.create({
      data: {
        orderId: createdOrder.id,
        transactionId: `txn_seed_${createdOrder.orderNumber}`,
        amount: createdOrder.totalAmount,
        status: 'SUCCEEDED',
        provider: 'STRIPE'
      }
    });
  }

  console.log('✅ Orders & Payments seeded');

  // 6. Audit Logs & Notifications
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INITIALIZATION',
      entity: 'System',
      details: JSON.stringify({ message: 'Enterprise E-Commerce Engine booted successfully with seed dataset.' })
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer1.id,
      title: 'Welcome to Enterprise E-Commerce',
      message: 'Your customer account is activated. Enjoy fast shipping and rewards.'
    }
  });

  console.log('🚀 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
