import { Request, Response } from "express";

import { UserService } from "../../services/user.service";

export class UserController {

  // PUT
  // update user profile (username, email)
  static async editProfileController(req: Request, res: Response) {
    const token: string = req.body.token;
    const userInfo: object  = req.body.userInfo;
    
    const User = new UserService(token, userInfo, null);
    const data = await User.editProfileService();

    return data.error
                    ? res.status(400).json({ error: true, detail: data.detail })
                    : res.status(201).json({ error: false, detail: data.detail });

  };

  // PUT
  // update user password
  static async changePasswordController(req: Request, res: Response) {
    const token: string = req.body.token;
    const password: string = req.body.password;

    const User = new UserService(token, null, password);
    const data = await User.changePasswordService();

    return data.error
                    ? res.status(400).json({ error: true, detail: data.detail })
                    : res.status(201).json({ error: false, detail: data.detail });
  };

  // DELETE
  // delete user account or user cluster
  static async deleteUserAccountController(req: Request, res: Response) {
    const token: string = req.body.token;

    const User = new UserService(token, null, null);
    const data = await User.deleteUserAccountService();

    return data.error
                    ? res.status(400).json({ error: true, detail: data.detail })
                    : res.status(201).json({ error: false, detail: data.detail });
  };

};