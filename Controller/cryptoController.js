import cryptoService from "../Service/cryptoService.js";

const cryptoController = {
  getQr: async (req, res) => {
    try {
      const { status, qr, message } = cryptoService.getQr(req.key);

      res.status(status ? 200 : 404).send(status ? { qr } : { message });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  createQr: async (req, res) => {
    try {
      const key = await cryptoService.createQr();

      console.log("key: ", key);
      res.send(key);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};
export default cryptoController;
