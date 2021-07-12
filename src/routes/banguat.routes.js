const express = require("express");
const _banguatController = require("../controllers/banguat.controller")

const router = express.Router();

//Ruta para acceder 
router.post("/promedio-tipo-cambio-rango", _banguatController.crearTipoCambioRango);
router.get("/promedios", _banguatController.getTiposCambio);

//Exportamos las configuraciones hacia el enrutador
module.exports = router;