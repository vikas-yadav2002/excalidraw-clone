import { Request, Response } from "express";
// import { signinSchema, SignupPayload, signupSchema, SigninPayload } from "../schema/authSchema";
import { signinSchema, SignupPayload, signupSchema, SigninPayload } from "@repo/common/types"
import jwt from "jsonwebtoken" // Import jsonwebtoken

import {JWT_SECRET} from "@repo/backend-common/config"

const signin = async (req: Request, res: Response) => {
  const data = req.body;
  const validationResult = signinSchema.safeParse(data);

  if (!validationResult.success) {
    // If validation fails, send a 400 Bad Request with validation errors
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResult.error,
    });
  }

  const { username, password }: SigninPayload = validationResult.data;

  console.log("Attempting signin for:", { username, password });

  // In a real app:
  // 1. Fetch user from DB by username
  // 2. Compare hashed password
  // if (!user || !await bcrypt.compare(password, user.hashedPassword)) {
  //   return res.status(401).json({ message: "Invalid credentials" });
  // }
  // --- End Placeholder ---

  // If authentication is conceptually successful, create a JWT
  const token = jwt.sign(
    { username: username, role: 'user' }, // Payload: include user-specific data (e.g., username, user ID, roles)
    JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour (adjust as needed)
  );

  res.status(200).json({
    message: "Signin successful",
    token: token, // Send the generated JWT to the client
    user: {
      username: username,
    },
  });
};

const signup = async (req: Request, res: Response) => {
  const data = req.body;
  const validationResult = signupSchema.safeParse(data);

  if (!validationResult.success) {
    // If validation fails, send a 400 Bad Request with validation errors
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResult.error, // Access .errors array for detailed Zod errors
    });
  }

  const newUser: SignupPayload = validationResult.data; // Use the inferred type for better safety

  // --- Placeholder for actual user creation logic (e.g., hash password, save to DB) ---
  // For now, we'll just assume user creation is successful.
  console.log("Attempting signup for:", newUser);

  // In a real app:
  // 1. Hash newUser.password (e.g., const hashedPassword = await bcrypt.hash(newUser.password, 10);)
  // 2. Check if username or email already exists in DB
  // 3. Save new user (with hashed password) to DB
  // --- End Placeholder ---

  // If user creation is conceptually successful, create a JWT
  const token = jwt.sign(
    { username: newUser.username,  role: 'user' }, // Payload
    JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  res.status(201).json({
    message: "Signup successful",
    token: token, 
    user: {
      username: newUser.username,
    },
  });
};

export { signin, signup };