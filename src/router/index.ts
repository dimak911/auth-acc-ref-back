import Router from "express";
import userController from "../controllers/user.controller";
import { catchAsync } from "../helpers/catchAsync";

const router = Router();

router.post("/registration", catchAsync(userController.registration));
router.post("/login", catchAsync(userController.login));
router.post("/logout", catchAsync(userController.logout));
router.get("/activate/:link", catchAsync(userController.activate));
router.get("/refresh", catchAsync(userController.refresh));
router.get("/users", catchAsync(userController.getUsers));

export default router;
