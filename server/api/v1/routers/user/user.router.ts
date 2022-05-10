import { Router } from "express";

import { UserController } from "./user.controller";
import { errorHandler } from "../../utils";

const UserRouter = Router();

UserRouter.put("/edit-profile", errorHandler(UserController.editProfileController));
UserRouter.put("/change-password", errorHandler(UserController.changePasswordController));
UserRouter.delete("/delete-user-account", errorHandler(UserController.deleteUserAccountController));

export { UserRouter };