import { Resend } from 'resend';

// 1. Initialize Resend only when key is available
const createResendClient = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

// 2. In-memory OTP storage
// Note: Vercel functions are stateless. For production, consider Upstash Redis.
if (!global.otpStore) {
  global.otpStore = new Map();
}
const sharedOtpStore = global.otpStore;

// --- Helpers ---
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- Main Handler ---
export default async function handler(req, res) {
  // Set JSON header immediately to prevent frontend "Unexpected end of JSON" errors
  res.setHeader('Content-Type', 'application/json');

  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 3. Parse Body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { email } = body;

    if (!email || !validateEmail(email.trim())) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 5. Generate and Store OTP
    const otp = generateOTP();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minute expiry

    sharedOtpStore.set(normalizedEmail, { otp, expiry });

    // 6. Send Email via Resend when configured; fallback to console OTP for local dev
    const resend = createResendClient();
    if (resend) {
      const { error } = await resend.emails.send({
        from: 'Crypto Wallet <auth@devshanidp.xyz>',
        to: normalizedEmail,
        subject: 'Your Login Code',
        html: `
          <div style="font-family: sans-serif; background: #0f172a; color: white; padding: 40px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
            <h2 style="color: #fbbf24; margin-bottom: 10px;">Verification Code</h2>
            <p style="color: #94a3b8;">Enter the following code to access your wallet:</p>
            <div style="background: #1e293b; padding: 20px; font-size: 42px; font-weight: bold; color: #6366f1; letter-spacing: 12px; margin: 25px 0; border-radius: 8px; border: 1px solid #475569;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 12px;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        console.error('Resend API Error details:', error);
        return res.status(500).json({
          error: 'Failed to send email',
          details: error.message,
        });
      }
    } else {
      console.log(`[DEV OTP] ${normalizedEmail}: ${otp}`);
    }

    // 7. Success Response
    return res.status(200).json({ 
      success: true, 
      message: `OTP sent to ${normalizedEmail}` 
    });

  } catch (err) {
    console.error("Global Handler Error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}