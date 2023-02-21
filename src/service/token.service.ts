import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/default";
import { IUserDto } from "../dtos/user.dto";
import { Types } from "mongoose";
import TokenModel, { ITokenDb } from "../models/token.model";

class TokenService {
  async generateTokens(payload: IUserDto) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "15d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: Types.ObjectId, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      return tokenData.save();
    }

    const token = await TokenModel.create({ user: userId, refreshToken });

    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });

    return tokenData;
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, JWT_ACCESS_SECRET) as IUserDto;

      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, JWT_REFRESH_SECRET) as IUserDto;

      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData: ITokenDb | null = await TokenModel.findOne({
      refreshToken,
    });

    return tokenData;
  }
}

export default new TokenService();
