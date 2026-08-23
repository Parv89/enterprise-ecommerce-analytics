import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const storedFile = await prisma.fileStorage.create({
      data: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      file: storedFile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
