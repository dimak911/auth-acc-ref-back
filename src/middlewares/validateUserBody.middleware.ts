import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const validateUserBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        error: "Invalid request body",
        details: err.issues.map((issue) => issue.message),
      });
    } else {
      next(err);
    }
  }
};
