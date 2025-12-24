// Simple in-memory user storage
// In production, this would be a database
const users = [];

// Helper function to find user by email
export const findUserByEmail = (email) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Helper function to create a new user
export const createUser = (userData) => {
  const newUser = {
    id: users.length + 1,
    studentId: generateStudentId(),
    email: userData.email,
    password: userData.password, // In production, this should be hashed
    name: userData.name,
    phone: userData.phone,
    class: userData.class,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  return newUser;
};

// Helper function to generate student ID
const generateStudentId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `STU${year}${randomNum}`;
};

// Helper function to get user without password
export const getUserWithoutPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get all users (for debugging)
export const getAllUsers = () => {
  return users.map(user => getUserWithoutPassword(user));
};

// Update user profile
export const updateUserProfile = (email, updates) => {
  const user = findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  // Update user properties
  if (updates.name !== undefined) user.name = updates.name;
  if (updates.phone !== undefined) user.phone = updates.phone;
  if (updates.class !== undefined) user.class = updates.class;
  if (updates.profilePicture !== undefined) user.profilePicture = updates.profilePicture;

  return user;
};
