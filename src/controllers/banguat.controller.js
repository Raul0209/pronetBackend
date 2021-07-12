const mssql = require('mssql');
//Libreria para manejar consultas hacia un webservice SOAP
const soap = require('soap');
const url = "https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx?WSDL";

//Creamos la funcion con la que vamos
function crearTipoCambioRango(req, res) {
    console.log("entras");
    var FECHAINIT = req.body.fechainit
    var FECHAFIN = req.body.fechafin

    //Generamos un cliente para gestionar la peticion hacia el webservice Banguat
    soap.createClient(url, function(err, client) {
        if (err) {
            //En caso de obtener un error lo mostramos al cliente
            return res.status(500).send({ error: "Error al acceder al webservice: " + error });
        } else {
            if (err) {
                //En caso de obtener un error lo mostramos al cliente
                return res.status(500).send({ error: "Error al acceder al webservice: " + error });
            } else {

                //Seteamos los parametros para filtrar los tipos de cambio
                let args = {
                        "fechainit": FECHAINIT,
                        "fechafin": FECHAFIN
                    }
                    //Ejecutamos el actionSoap que nos devuelve los tipos de cambio
                client.TipoCambioRango(args, function(err, response) {
                    if (err) {
                        //En caso de obtener error en la consulta lo mostramos al cliente
                        return res.status(500).send({ error: "Error al ejecutar el metodo: " + err });

                    }
                    //Variable donde almacenaremos el promedio total
                    var total;

                    //Variable donde almacenaremos el acumulado de totalVenta
                    var totalVenta = 0;

                    //Variable donde almacenaremos el acumulado de totalCompra
                    var totalCompra = 0;

                    //Guardamos la cantidad de registros para promediarlos
                    var divisor = response.TipoCambioRangoResult.Vars.Var.length + 1;
                    //Recorremos todos los valores para acumularlos y hacer el promedio
                    for (let x = 0; x < response.TipoCambioRangoResult.Vars.Var.length; x++) {
                        var totalVenta = totalVenta + response.TipoCambioRangoResult.Vars.Var[x].venta;
                        var totalCompra = totalCompra + response.TipoCambioRangoResult.Vars.Var[x].compra;
                    }

                    //Guardamos promedios
                    var totalVentaPromedio = 0;
                    totalVentaPromedio = totalVenta / divisor;

                    var totalCompraPromedio = 0;
                    totalCompraPromedio = totalCompra / divisor;

                    total = (totalVenta + totalCompra) / (divisor * 2);

                    //Guardamos la peticion en la base de datos
                    const request = new mssql.Request();

                    //Seteamos los parametros de la peticion
                    request.input("FECHA_FINAL", FECHAFIN);
                    request.input("FECHA_INICIAL", FECHAINIT);
                    request.input("PROMEDIO_VENTA", totalVentaPromedio);
                    request.input("PROMEDIO_COMPRA", totalCompraPromedio);

                    //Ejecutamos el procedimiento almacenado
                    request.execute('SP_CREAR_TIPO_CAMBIO', (err, response) => {
                        if (err) return res.status(500).send({ error: 'Error en la peticion al servidor', descripcion: err });
                        console.log(response);
                        // if (response) return res.status(200).send({ promedio: response.recordset });
                    })

                    //Retornamos los promedios
                    return res.status(200).send({ promedio: { totalVenta: totalVentaPromedio, totalCompra: totalCompraPromedio, total: total, fechafin: FECHAFIN, fechainit: FECHAINIT } });
                })
            }
        }
    })
}

//Obtenemos los datos para pintarlos en el frontend
function getTiposCambio(req, res) {
    const request = new mssql.Request();
    request.execute('SP_OBTENER_TIPOS_CAMBIO', (err, response) => {
        //Al obtener un error
        if (err) return res.status(500).send({ error: 'Error en la peticion al servidor', descripcion: err });

        //Al no contar con datos
        if (response.recordset.length == 0) return res.status(200).send({ noPromedios: 'No existen direcciones en la base de datos' });

        if (response.recordset.length > 0) return res.status(200).send({ promedios: response.recordset });
    })
}

//Exportamos la funcion para ser usada desde la ruta
module.exports = {
    crearTipoCambioRango,
    getTiposCambio
}