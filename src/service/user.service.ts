import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import mailService from "./mail.service";
import ApiError from "../helpers/ApiError";
import UserModel, { IUser } from "../models/user.model";
import tokenService from "./token.service";
import UserDto, { IUserDto } from "../dtos/user.dto";
import { API_URL } from "../config/default";

class UserService {
  async createUser(email: string, password: string) {
    const candidate: IUser | null = await UserModel.findOne({ email });

    if (candidate) {
      throw new ApiError(`User with email ${email} already exists`, 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid();
    const user: IUser = await UserModel.create({
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
    const user: IUser | null = await UserModel.findOne({ email });

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

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError("Invalid token", 401);
    }

    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new ApiError("Unauthorized", 401);
    }

    const user = (await UserModel.findById(userData.id)) as IUser;
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({
      activationLink,
    });

    if (!user) {
      throw new ApiError("Incorrect activation link", 400);
    }

    user.isActivated = true;
    await user.save();
  }

  async getAllUsers() {
    const users = await UserModel.find();

    return users;
  }
}

export default new UserService();
