/**
 * Email Service Utility
 * Handles sending emails for password resets and login credentials
 * 
 * NOTE: This is a basic implementation. Configure with your email provider.
 * For Gmail: Enable "Less secure app access" or use App Passwords
 * For production: Use SendGrid, AWS SES, or similar service
 */

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    // For now, we'll log to console
    // In production, integrate with actual email service
    console.log('\n=== PASSWORD RESET EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset Link: http://localhost:5173/reset-password/${resetToken}`);
    console.log('===========================\n');
    
    // TODO: Implement actual email sending
    // Example with nodemailer:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - PGC Student Portal',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="http://localhost:5173/reset-password/${resetToken}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send login credentials email for new students
 * @param {string} email - Student email
 * @param {string} name - Student name
 * @param {string} studentId - Generated student ID
 * @param {string} password - Generated password
 * @returns {Promise<void>}
 */
export const sendLoginCredentialsEmail = async (email, name, studentId, password) => {
  try {
    console.log('\n=== LOGIN CREDENTIALS EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Student ID: ${studentId}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Login URL: http://localhost:5173/login`);
    console.log('================================\n');
    
    // TODO: Implement actual email sending
    // Example with nodemailer:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to PGC - Your Login Credentials',
      html: `
        <h2>Welcome to Punjab Group of Colleges!</h2>
        <p>Dear ${name},</p>
        <p>Your admission application has been received. Here are your login credentials for the Student Portal:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Student ID:</strong> ${studentId}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p>Login at: <a href="http://localhost:5173/login">Student Portal</a></p>
        <p><strong>Important:</strong> Please change your password after first login.</p>
        <p>If you have any questions, contact our support team.</p>
      `
    });
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error sending login credentials email:', error);
    throw new Error('Failed to send login credentials email');
  }
};

export default { sendPasswordResetEmail, sendLoginCredentialsEmail };
