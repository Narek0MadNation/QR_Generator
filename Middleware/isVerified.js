import { compareSync } from "bcrypt";
import crypto from "crypto";
import { readFileSync } from "fs";

const isVerified = (req, res, next) => {
  const { key } = req.body;
  console.log(req.headers);
  if (!key) {
    return res.status(400).json({ error: "No key provided." });
  }

  const validFormat = /^[0-9A-F]{8}$/.test(key);

  if (!validFormat) {
    return res.status(400).json({ error: "Invalid key format." });
  }

  const usedKeys = JSON.parse(readFileSync("usedKeys.json", "utf-8"));

  if (usedKeys.find((usedKey) => compareSync(key, usedKey))) {
    return res.status(400).send({ error: "Key has already been used" });
  }

  req.key = key;

  next();
};

export default isVerified;
