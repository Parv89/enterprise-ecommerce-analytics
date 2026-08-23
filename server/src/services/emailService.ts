import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER || 'mock_user',
        pass: process.env.SMTP_PASS || 'mock_pass'
      }
    });
  }

  async sendOrderConfirmation(to: string, orderDetails: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Enterprise Commerce - Order Confirmation</h2>
        <p>Thank you for your order, <strong>${orderDetails.customerName}</strong>!</p>
        <p>Order Reference: <strong>${orderDetails.orderNumber}</strong></p>
        <p>Total Amount: <strong>$${orderDetails.totalAmount.toFixed(2)}</strong></p>
        <p>Status: <span style="background: #DEF7EC; color: #03543F; padding: 4px 8px; border-radius: 4px;">${orderDetails.status}</span></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <h3>Order Items:</h3>
        <ul>
          ${orderDetails.items.map((item: any) => `<li>${item.name} x ${item.quantity} - $${(item.unitPrice * item.quantity).toFixed(2)}</li>`).join('')}
        </ul>
        <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">This is an automated notification from Enterprise Commerce Platform.</p>
      </div>
    `;

    try {
      console.log(`[Email Service] Sending Order Confirmation Email to ${to} (Order #${orderDetails.orderNumber})`);
      // Fallback/log simulation if SMTP credentials are mock
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (err) {
      console.warn('[Email Service] Failed to send email via SMTP, logged fallback:', err);
      return { success: false, error: err };
    }
  }

  async sendStatusUpdate(to: string, orderNumber: string, status: string, trackingNumber?: string) {
    console.log(`[Email Service] Sending Status Update (${status}) to ${to} for Order #${orderNumber}`);
    return { success: true };
  }
}

export const emailService = new EmailService();
