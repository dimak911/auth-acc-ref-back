import Router from "express";
import userController from "../controllers/user.controller";
import { catchAsync } from "../helpers/catchAsync";
import { validateUserBody } from "../middlewares/validateUserBody";

const router = Router();

router.post(
  "/registration",
  validateUserBody,
  catchAsync(userController.registration)
);
router.post("/login", validateUserBody, catchAsync(userController.login));
router.post("/logout", catchAsync(userController.logout));
router.get("/activate/:link", catchAsync(userController.activate));
router.get("/refresh", catchAsync(userController.refresh));
router.get("/users", catchAsync(userController.getUsers));

export default router;
