import { Router } from "express";
import cryptoController from "../Controller/cryptoController.js";
import isVerified from "../Middleware/isVerified.js";

const cryptoRouter = Router();

cryptoRouter.get("/", isVerified, cryptoController.getQr);

cryptoRouter.post("/", cryptoController.createQr);

export default cryptoRouter;
