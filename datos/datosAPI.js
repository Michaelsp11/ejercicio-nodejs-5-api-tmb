require("dotenv").config();
const fetch = require("node-fetch");

const urlLineas = `${process.env.URL_API}?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`;
const getLineasTMB = async () => {
  const resp = await fetch(urlLineas);
  const datos = resp.json();
  return datos;
};
module.exports = {
  getLineasTMB,
};
