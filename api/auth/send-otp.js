import { Resend } from 'resend';

// This pulls the key you just saved in Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(email, otp) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // You MUST use this exact address for testing
      to: email,
      subject: 'Your Crypto Wallet OTP',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Verification Code</h2>
          <p>Your one-time password is:</p>
          <h1 style="color: #6366f1; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    return true;
  } catch (err) {
    console.error("Email delivery failed:", err);
    throw err;
  }
}