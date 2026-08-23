import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, isFeatured, sortBy, page = 1, limit = 12 } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
        { sku: { contains: search as string } }
      ];
    }

    if (category) {
      where.category = {
        slug: category as string
      };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'rating') orderBy = { ratingsAvg: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      products: products.map(p => ({ ...p, images: JSON.parse(p.images || '[]') })),
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

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({
      success: true,
      product: { ...product, images: JSON.parse(product.images || '[]') }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, compareAtPrice, stock, sku, categoryId, images, isFeatured } = req.body;

    if (!name || !description || price === undefined || !sku || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name, description, price, SKU, and categoryId are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock) || 0,
        sku,
        categoryId,
        images: JSON.stringify(Array.isArray(images) ? images : [images || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30']),
        isFeatured: Boolean(isFeatured)
      },
      include: { category: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'CREATE_PRODUCT',
        entity: 'Product',
        details: JSON.stringify({ productId: product.id, name: product.name })
      }
    });

    res.status(201).json({
      success: true,
      product: { ...product, images: JSON.parse(product.images) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, compareAtPrice, stock, sku, categoryId, images, isFeatured } = req.body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (compareAtPrice !== undefined) dataToUpdate.compareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : null;
    if (stock !== undefined) dataToUpdate.stock = parseInt(stock);
    if (sku !== undefined) dataToUpdate.sku = sku;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (images !== undefined) dataToUpdate.images = JSON.stringify(images);
    if (isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(isFeatured);

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: { category: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'UPDATE_PRODUCT',
        entity: 'Product',
        details: JSON.stringify({ productId: product.id, name: product.name })
      }
    });

    res.json({
      success: true,
      product: { ...product, images: JSON.parse(product.images) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'DELETE_PRODUCT',
        entity: 'Product',
        details: JSON.stringify({ productId: id })
      }
    });

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } }
      }
    });
    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
