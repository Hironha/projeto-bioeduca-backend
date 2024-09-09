import { getAuth } from "firebase-admin/auth";

import type { Request, Response, NextFunction } from "express";

/**
 * Validates if request is authenticated via firebase based on received bearer token.
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers["authorization"] as string).split(" ").at(1);
    if (!token) throw new Error();

    const auth = getAuth();
    await auth.verifyIdToken(token, true);
    next();
  } catch (e) {
    console.error(`Failed authentication validation at ${req.path}`);
    const body = {
      code: "UNA-001",
      message: "User is not authenticated. Please log in to access resources.",
    };
    res.status(201).json(body);
  }
};
