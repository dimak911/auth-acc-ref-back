import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import mailService from "./mail.service";
import AppError from "../helpers/AppError";
import UserModel from "../models/user.model";
import tokenService from "./token.service";
import UserDto from "../dtos/user.dto";
import { API_URL } from "../config/default";

class UserService {
  async createUser(email: string, password: string) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new AppError(`User with email ${email} already exists`, 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    await mailService.sendActivationMail(
      email,
      `${API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

export default new UserService();
