import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter = null;

if (ENV.SMTP_HOST && ENV.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });
}

/**
 * Sends a branded OTP verification email or returns test preview
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.code - 6-digit OTP code
 * @param {string} options.purpose - Purpose of the code (e.g. 'Registration', 'Password Reset', 'Login')
 * @returns {Promise<{ delivered: boolean, previewOtp: string }>}
 */
export const sendOtpEmail = async ({ to, code, purpose = 'Registration' }) => {
  const subjectMap = {
    Registration: 'Your OpenPath Verification Code',
    'Password Reset': 'Reset Your OpenPath Password',
    Login: 'Your OpenPath Login Code',
  };

  const subject = subjectMap[purpose] || 'Your OpenPath Verification Code';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #111827; border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.25); overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
              <!-- Header Gradient -->
              <tr>
                <td style="padding: 32px 32px 20px 32px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.15) 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                  <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                    Open<span style="color: #c084fc;">Path</span>
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; font-weight: 500;">
                    Transparent & Explainable Opportunity Matching
                  </p>
                </td>
              </tr>
              <!-- Body Content -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #f1f5f9;">
                    ${
                      purpose === 'Password Reset'
                        ? 'Password Reset Verification'
                        : purpose === 'Login'
                        ? 'Account Sign-In Verification Code'
                        : 'Verify Your Email Address'
                    }
                  </h2>
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                    ${
                      purpose === 'Password Reset'
                        ? 'We received a request to reset your OpenPath account password. Use the verification code below to confirm this action:'
                        : purpose === 'Login'
                        ? 'We received a sign-in request for your OpenPath account. Use the single-use 6-digit verification code below to log in safely:'
                        : 'Welcome to OpenPath! Please enter the 6-digit verification code below to verify your email and complete your account setup:'
                    }
                  </p>
                  
                  <!-- OTP Highlight Card -->
                  <div style="background-color: #1e1b4b; border: 1px solid #7c3aed; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px 0;">
                    <span style="font-size: 12px; font-weight: 700; color: #c084fc; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 8px;">
                      Your Single-Use Verification Code
                    </span>
                    <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">
                      ${code}
                    </span>
                  </div>

                  <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                    ⏱️ This code expires in <strong>10 minutes</strong>. If you did not make this request, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 32px; background-color: #0d121f; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 12px; color: #64748b;">
                  © ${new Date().getFullYear()} OpenPath Career Platform. Built for early career talent.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  console.log(`\n=================================================`);
  console.log(`📧 [OPENPATH EMAIL SERVICE]`);
  console.log(`To: ${to}`);
  console.log(`Purpose: ${purpose}`);
  console.log(`OTP Code: ${code}`);
  console.log(`=================================================\n`);

  let delivered = false;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: ENV.EMAIL_FROM,
        to,
        subject,
        html: htmlContent,
      });
      delivered = true;
      console.log(`✅ [EMAIL SERVICE] Message successfully dispatched via SMTP to ${to}`);
    } catch (err) {
      console.error(`⚠️ [EMAIL SERVICE] SMTP delivery failed: ${err.message}. Retaining demo preview code.`);
    }
  }

  return {
    delivered,
    previewOtp: code,
  };
};
