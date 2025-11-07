import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
  userType: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.authToken;

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded || typeof decoded === "string") {
      res.status(403).json({ error: "Invalid token format" });
      return;
    }

    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.authToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded !== "string") {
        req.user = decoded as JwtPayload;
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
      req.user = undefined;
    }
  }

  next();
};
