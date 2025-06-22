const express = require('express');
const path = require('path');
const app = express();
const oMysql = require('mysql'); 

// Conexión MySQL
const oConexion = oMysql.createConnection({
  host: 'localhost',
  database: 'farmaciasnigeria',
  user: "root",
  password: ""
});

// Middlewares
app.use(express.urlencoded({ extended: true })); // Para recibir datos de formularios

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'Public')));

// Ruta principal
app.get('/', (req, res) => {
  res.render('pages/index'); // Renderiza views/index.ejs
});

// Página Home - muestra todos los productos
app.get('/home', (req, res) => {
  const sql = "SELECT * FROM productos";
  oConexion.query(sql, function (error, results) {
    if (error) {
      // Muestra error amigable
      return res.status(500).send('Error al consultar productos');
    }
    res.render('pages/home', { productos: results });
  });
});

// POST (son para agregar datos a la base de datos))
app.post("/post", (req, res) => {
  const { NombreProducto, Precio, Cantidad, Descripcion } = req.body;
  const sql = "INSERT INTO productos VALUES (null, ?, ?, ?, ?)";
  const params = [NombreProducto, Precio, Cantidad, Descripcion];

  oConexion.query(sql, params, function (error) {
    if (error) {
      // Muestra error amigable
      return res.status(500).send('Error al agregar producto');
    }
    console.log("Producto agregado exitosamente");
    res.redirect('/home');
  });
});

// Rutas de páginas
app.get('/log-in', (req, res) => {//<<<<<<========== esta es la ruta que se usa en un href (href="/Log-in") los demas funcionan igual)
  res.render('pages/Log-in'); // Renderiza views/pages/Log-in.ejs
});

app.get('/carrito', (req, res) => {//cuando llamen a /carrito, se renderiza la direccción de la vista /pages/Carrito.ejs
  res.render('pages/Carrito'); // Renderiza views/pages/Carrito.ejs
});

app.get('/vistametodopago', (req, res) => {
  res.render('pages/VistaMetodoPago'); // Renderiza views/pages/VistaMetodoPago.ejs
});

app.get('/registroproductos', (req, res) => {
  res.render('pages/RegistroProductos'); // Renderiza views/pages/RegistroProductos.ejs
});


// Puerto y servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
