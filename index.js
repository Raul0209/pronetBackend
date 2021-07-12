const mssql = require("mssql");
const app = require("./app");

//Seteamos el puerto dentro de contexto de nodeJS
//Si el servidor nos da uno lo usamos, si no colocamos el 30001
app.set('port', process.env.PORT || 3000);

//Configuraciones y credenciales para conectar a la base de datos
const config = {
    user: 'pronet',
    password: '123',
    server: `localhost`,
    port: 1433,
    database: 'pronet',
    options: {
        trustServerCertificate: true,
    }
}

//Realizamos la conexion con SQL Server
const connection = mssql.connect(config, function(err) {
    if (err) {
        throw err
    } else {
        console.log('Conectado a la base de datos: ' + config.database);
    }
})

//Levantamos el servidor para asi poder acceder al sistema
const server = app.listen(app.get('port'), () => {
    console.log('El servidor se encuentra corriendo en el puerto: ' + app.get('port'));

})