import { Request, Response, NextFunction } from "express";
import { APP_URL } from "../config/default";
import ApiError from "../helpers/ApiError";
import userService from "../service/user.service";

const cookieConfig = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  // secure: true
};

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const userData = await userService.createUser(email, password);
    res.cookie("refreshToken", userData.refreshToken, cookieConfig);

    return res.json(userData);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const userData = await userService.login(email, password);
    res.cookie("refreshToken", userData.refreshToken, cookieConfig);

    return res.json(userData);
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.json(token);
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    const activationLink = req.params.link;

    await userService.activate(activationLink);

    return res.redirect(APP_URL);
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;

    const userData = await userService.refresh(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, cookieConfig);

    return res.json(userData);
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = await userService.getAllUsers();

    return res.json(users);
  }
}

export default new UserController();
