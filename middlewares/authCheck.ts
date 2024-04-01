import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const authCheck = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { token } = request.cookies;

    if (!token) throw new Error();

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) throw new Error();

    const { id } = verify(token, jwtSecretKey) as JwtPayload;
    request.loggedInUserId = id;

    next();
  } catch {
    request.loggedInUserId = "";
    response.clearCookie("token");
    response.status(401).send("Authentication failed");
  }
};
