import { Schema, model, Types } from "mongoose";

export interface ITokenDb {
  user: Types.ObjectId;
  refreshToken: string;
}

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

const TokenModel = model("Token", TokenSchema);

export default TokenModel;
