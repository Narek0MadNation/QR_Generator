import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import usersRouter from "./Route/usersRouter.js";
import cryptoRouter from "./Route/cryptoRouter.js";
import dotenv from "dotenv";
import authRouter from "./Route/authRoute.js";

const app = express();
dotenv.config();
// connection();
app.use(helmet());

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "Public")));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/crypto", cryptoRouter);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
