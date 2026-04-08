import { Resend } from 'resend'

// In-memory OTP storage with expiry
// Note: Vercel functions are stateless; in-memory storage may reset between requests.
// For production, consider using Redis (Upstash) or a database.
if (!global.otpStore) {
  global.otpStore = new Map();
}
const sharedOtpStore = global.otpStore;

const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation helper
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate random 6-digit OTP
function generateOTP(length = 6) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}

// Email sending logic with Resend
async function sendEmail(email, otp) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Use this for testing
      to: email,
      subject: 'Your Wallet OTP',
      html: `<strong>Your OTP is: ${otp}</strong>`
    });
    return true;
  } catch (error) {
    console.error("Email failed:", error);
    throw error;
  }
}

// MAIN HANDLER
export default async function handler(req, res) {
  // 1. Set JSON header immediately to avoid "Unexpected end of JSON" on frontend
  res.setHeader('Content-Type', 'application/json');

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 3. Parse body safely
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (parseError) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }

    const { email } = body;

    // 4. Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 5. Rate limiting
    const now = Date.now();
    if (sharedOtpStore.has(normalizedEmail)) {
      const { attempts, lastAttempt } = sharedOtpStore.get(normalizedEmail);
      const timeSinceLastAttempt = now - lastAttempt;

      if (timeSinceLastAttempt < 5 * 60 * 1000 && attempts >= 3) {
        return res.status(429).json({
          error: 'Too many requests. Please try again in 5 minutes.'
        });
      }
    }

    // 6. Generate and store OTP
    const otp = generateOTP(6);
    const expiryTime = now + 10 * 60 * 1000; // 10 min expiry

    const currentData = sharedOtpStore.get(normalizedEmail) || { attempts: 0 };
    sharedOtpStore.set(normalizedEmail, {
      otp,
      expiryTime,
      attempts: currentData.attempts + 1,
      lastAttempt: now,
    });

    // 7. Send the email
    await sendEmail(normalizedEmail, otp);

    // 8. Final Success Response
    return res.status(200).json({
      success: true,
      message: `OTP sent to ${normalizedEmail}`,
    });

  } catch (error) {
    console.error('send-otp error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Cleanup expired OTPs periodically
if (typeof global !== 'undefined' && !global.otpCleanupInterval) {
  global.otpCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [email, data] of sharedOtpStore.entries()) {
      if (data.expiryTime < now) {
        sharedOtpStore.delete(email);
      }
    }
  }, 5 * 60 * 1000);
}