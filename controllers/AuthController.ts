import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

export class AuthController {
  static async login(
    request: Request<any, any, { email: string; password: string }>,
    response: Response<string>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = request.body;

      //使用するORMに応じて書き換える
      const loggingInUser = await this.userRepository.findOne({
        where: {
          email: payload.email,
        },
      });

      if (!loggingInUser) throw new Error();

      const isPasswordCorrect = await bcrypt.compare(
        password,
        loggingInUser.password
      );

      if (!isPasswordCorrect) throw new Error();

      const jwtPayload = {
        id: loggingInUser.id,
        email: loggingInUser.email,
      };

      const token = sign(jwtPayload, "JWT_SECRET_KEY", {
        expiresIn: "1h",
      });

      response.cookie("token", token, {
        httpOnly: true, //XSS対策
        secure: true,
      });

      response.send(loggingInUser.id);
    } catch {
      response.status(401).send("Login failed");
    }
  }
}
