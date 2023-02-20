import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./router";
import ApiError from "./helpers/ApiError";
import { DB_URI, PORT } from "./config/default";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", router);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(
    `Could not find ${req.originalUrl} on this server!`,
    404
  );
  next(error);
});

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URI);
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
