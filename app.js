//Utilizamos express para montar nuestro servidor http
const express = require("express");
//Englobamos express dentro de variable app
const app = express();
//Habilitamos los cors para las peticions
const cors = require("cors");
const router = express.Router();
//Para convertir y manejar las consultas http
const bodyParser = require("body-parser");

//Rutas 
const _banguatRoutes = require("./src/routes/banguat.routes");

//Aca configuramos el middleware para obtener el cuerpo de la url y utilizar JSON como metodo de transferencia de datos
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Cuando accedemos a la ruta API enlazamos las rutas de banguat 
app.use("/api", _banguatRoutes);

//exportamos la configuracion
module.exports = app;