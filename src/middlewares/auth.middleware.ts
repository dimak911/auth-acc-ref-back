import { Request, Response, NextFunction } from "express";
import ApiError from "../helpers/ApiError";
import tokenService from "../service/token.service";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new ApiError("Unauthorized", 401);
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      throw new ApiError("Unauthorized", 401);
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      throw new ApiError("Unauthorized", 401);
    }

    res.locals = userData;
    next();
  } catch (e) {
    const error = new ApiError("Unauthorized", 401);
    return next(error);
  }
};
