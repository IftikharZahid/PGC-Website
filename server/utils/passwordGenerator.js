/**
 * Password Generator Utility
 * Generates secure, pronounceable passwords for auto-registration
 */

/**
 * Generate a random password
 * @param {number} length - Length of password (default: 8)
 * @returns {string} - Generated password
 */
export const generatePassword = (length = 8) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%&*';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // Ensure password has at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Generate a random reset token
 * @returns {string} - 32-character hex token
 */
export const generateResetToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

export default { generatePassword, generateResetToken };
