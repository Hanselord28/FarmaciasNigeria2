mysql = require('mysql');
oConexion = mysql.createConnection({
    host:'localhost',
    database:'farmaciasnigeria',
    user:'root',
    password:''

});

oConexion.connect(function(PosibleError){
    if(PosibleError){
        throw(PosibleError);
        oConexion.end();
    }else {
        console.log("conexion Exitosa");
        oConexion.end();
    }
});