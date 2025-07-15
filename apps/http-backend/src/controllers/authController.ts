import { Request, Response } from "express";
import {
  signinSchema,
  signupSchema,
  // SigninPayload,
  // SignupPayload,
} from "@repo/common/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";

// -------------------- SIGNIN --------------------

const signin = async (req: Request, res: Response) => {
  const data = req.body;
  const validationResult = signinSchema.safeParse(data);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResult.error,
    });
  }

  const { email , password } = validationResult.data;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- SIGNUP --------------------

const signup = async (req: Request, res: Response) => {
  const data = req.body;
  const validationResult = signupSchema.safeParse(data);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResult.error,
    });
  }

  const { email, name, password } = validationResult.data;

  try {
    // Check if user with same username or email already exists
    const existingUser = await prismaClient.user.findFirst({
      where: {
        OR: [{ email }, { name }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      },
    });

    const token = jwt.sign(
      { id: user.id, username: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name, 
        email : user.email
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signin, signup };
