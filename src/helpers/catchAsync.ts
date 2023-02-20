import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      next(new ApiError(err.message, err.statusCode || 500));
    });
  };
};
