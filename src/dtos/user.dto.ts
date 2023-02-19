import { Types } from "mongoose";
import { IUser } from "../models/user.model";

export interface IUserDto {
  email: string;
  id: Types.ObjectId;
  isActivated: boolean;
}

class UserDto implements IUserDto {
  email: string;
  id: Types.ObjectId;
  isActivated: boolean;

  constructor(model: IUser) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}

export default UserDto;
