import { compareSync, hashSync } from "bcrypt";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import QRCode from "qrcode";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { encode, decode } from "base64-url";

const cryptoService = {
  getQr: (key) => {
    try {
      const dataJS = JSON.parse(readFileSync("data.json", "utf-8"));

      const qr = dataJS.find((crypt) => compareSync(key, crypt[0]));

      if (!qr) {
        return {
          status: false,
          message: "No QR code found for the provided key.",
        };
      }

      const decodedQrPath = decode(qr[1]);

      setTimeout(() => {
        unlinkSync(decodedQrPath);
        writeFileSync(
          "data.json",
          JSON.stringify(dataJS.filter((crypt) => crypt !== qr))
        );

        writeFileSync(
          "usedKeys.json",
          JSON.stringify([
            ...JSON.parse(readFileSync("usedKeys.json", "utf-8")),
            qr[0],
          ])
        );
      }, 5000);

      return { status: true, qr: decodedQrPath };
    } catch (error) {
      console.error("Error retrieving QR code:", error);
      throw error;
    }
  },

  createQr: async () => {
    try {
      const key = crypto.randomBytes(4).toString("hex").toUpperCase();

      const qrFilePath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
        "Public",
        "qr_codes",
        `${key}.png`
      );

      if (!existsSync("data.json")) writeFileSync("data.json", "[]");

      await QRCode.toFile(qrFilePath, key);

      const dataJS = JSON.parse(readFileSync("data.json", "utf-8"));

      writeFileSync(
        "data.json",
        JSON.stringify([...dataJS, [hashSync(key, 10), encode(qrFilePath)]])
      );

      return { key };
    } catch (error) {
      console.error("Error creating QR:", error);
      throw error;
    }
  },
};

export default cryptoService;
