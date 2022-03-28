import { Router } from "express";

import { AuthController } from "./auth.controller";
import { errorHandler } from "../../utils";

const AuthRouter = Router();

AuthRouter.post('/register', errorHandler(AuthController.registerController));
AuthRouter.post('/login', errorHandler(AuthController.loginController));

export { AuthRouter };