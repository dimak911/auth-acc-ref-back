import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import mailService from "./mail.service";
import ApiError from "../helpers/ApiError";
import UserModel from "../models/user.model";
import tokenService from "./token.service";
import UserDto from "../dtos/user.dto";
import { API_URL } from "../config/default";

class UserService {
  async createUser(email: string, password: string) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new ApiError(`User with email ${email} already exists`, 400);
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

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new ApiError(`No user with email ${email}`, 400);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new ApiError("Invalid password", 400);
    }

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw new ApiError("Incorrect activation link", 400);
    }

    user.isActivated = true;
    await user.save();
  }
}

export default new UserService();
