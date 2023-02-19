import { Request, Response, NextFunction } from "express";
import AppError from "../helpers/AppError";
import userService from "../service/user.service";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const userData = await userService.createUser(email, password);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true
    });

    return res.json(userData);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    //
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    //
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    //
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    //
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    throw new AppError("Oooops!", 444);
  }
}

export default new UserController();
