import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export const router: Router = Router();

router.post("/login", AuthController.login);
