require("dotenv").config();
const { program } = require("commander");
const express = require("express");
const { getLineasTMB } = require("./datos/datosAPI");

const app = express();
program.option("-p,--puerto <puerto>", "Puerto API");
program.parse(process.argv);
const opciones = program.opts();
const puerto = opciones.puerto || process.env.PUERTO || 4000;
const server = app.listen(puerto, () => {
  console.log(`Servidor escuchando por el puerto ${puerto}`);
});
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    error.message = `El puerto ${puerto} está en uso.`;
  }
  console.log(`No se ha podido levantar el servidor: \n${error.message}`);
});
app.get("/metro/lineas", async (req, res, next) => {
  const { features } = await getLineasTMB();
  res.json(features);
});
