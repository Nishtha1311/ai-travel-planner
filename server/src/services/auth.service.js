import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Validate input
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

 // Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Create user
const user = await User.create({
  name,
  email,
  password: hashedPassword,
});

// Generate JWT
const token = generateToken(user._id);

// Return safe user data
return {
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  },
  token,
};
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
};