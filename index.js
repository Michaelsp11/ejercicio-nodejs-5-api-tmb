require("dotenv").config();
const { program } = require("commander");
const express = require("express");
const morgan = require("morgan");
const { getLineasTMB, getParadasLineaTMB } = require("./datos/datosAPI");

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
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
app.get("/metro/lineas", async (req, res, next) => {
  const { features } = await getLineasTMB();
  const resultado = features.reduce(
    (acumulador, { properties: { ID_LINIA, NOM_LINIA, DESC_LINIA } }) => [
      ...acumulador,
      {
        id: ID_LINIA,
        linea: NOM_LINIA,
        descripcion: DESC_LINIA,
      },
    ],
    []
  );
  res.json(resultado);
});
app.get("/metro/linea/:codi", async (req, res, next) => {
  const codiLinea = req.params.codi;
  const { features: featuresParadas } = await getParadasLineaTMB(codiLinea);
  let resultado = {};
  let paradas = [];
  for (const {
    properties: { NOM_LINIA, DESC_SERVEI, ID_ESTACIO, NOM_ESTACIO },
  } of featuresParadas) {
    if (
      typeof resultado.linea === "undefined" &&
      typeof resultado.descripcion === "undefined"
    ) {
      resultado = { ...resultado, linea: NOM_LINIA, descripcion: DESC_SERVEI };
    }
    paradas = [...paradas, { id: ID_ESTACIO, nombre: NOM_ESTACIO }];
  }
  resultado = { ...resultado, paradas };
  res.json([resultado]);
});
app.post((req, res, next) => {
  res.json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
});
app.put((req, res, next) => {
  res.json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
});
app.delete((req, res, next) => {
  res.json({ error: true, mensaje: "Te pensabas que podías jaquearme" });
});
app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
app.use((err, req, res, next) => {
  res.status(500).json({ error: true, mensaje: "Error general" });
});
