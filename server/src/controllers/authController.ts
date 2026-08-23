import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role && ['ADMIN', 'MANAGER', 'CUSTOMER'].includes(role.toUpperCase()) 
      ? role.toUpperCase() 
      : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: assignedRole
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'enterprise_ecommerce_analytics_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        entity: 'User',
        details: JSON.stringify({ email: user.email, role: user.role })
      }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, phone, identifier, password } = req.body;
    const rawInput = (email || phone || identifier || '').trim();

    if (!rawInput || !password) {
      return res.status(400).json({ success: false, message: 'Email/Phone and password are required.' });
    }

    const digitsOnly = rawInput.replace(/\D/g, '');

    // Fetch all users to match email OR exact phone OR normalized digits
    const allUsers = await prisma.user.findMany();
    const user = allUsers.find((u) => {
      if (u.email.toLowerCase() === rawInput.toLowerCase()) return true;
      if (u.phone && u.phone.trim() === rawInput) return true;
      if (digitsOnly.length >= 6 && u.phone) {
        const uDigits = u.phone.replace(/\D/g, '');
        if (uDigits.includes(digitsOnly) || digitsOnly.includes(uDigits)) return true;
      }
      return false;
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found for this email/phone.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password does not match.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'enterprise_ecommerce_analytics_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        details: JSON.stringify({ rawInput, userEmail: user.email })
      }
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
