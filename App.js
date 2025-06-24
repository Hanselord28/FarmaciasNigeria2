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
// Ruta para el registro de usuario
app.post('/register', (req, res) => {
  const { usuario, correo, password } = req.body;
  // Aquí procesas el registro (guardar en la base de datos, etc.)
  res.send('¡Usuario registrado!');
});


// Ruta para procesar pagos de mercado pago
// Esta ruta recibe los datos del pago y los procesa
app.post('/process_payment', express.json(), async (req, res) => {
  try {
    const result = await payment.create({ body: req.body });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el pago', details: error.message });
  }
});

// Rutas de páginas
app.get('/log-in', (req, res) => {//<<<<<<========== esta es la ruta que se usa en un href (href="/Log-in") los demas funcionan igual)
  res.render('pages/Log-in'); // Renderiza views/pages/Log-in.ejs
});

app.get('/Carrito', (req, res) => {//cuando llamen a /carrito, se renderiza la direccción de la vista /pages/Carrito.ejs
  res.render('pages/Carrito'); // Renderiza views/pages/Carrito.ejs
});

app.get('/vistametodopago', (req, res) => {
  res.render('pages/VistaMetodoPago'); // Renderiza views/pages/VistaMetodoPago.ejs
});

app.get('/registroproductos', (req, res) => {
  res.render('pages/RegistroProductos'); // Renderiza views/pages/RegistroProductos.ejs
});

app.get('/preinicio', (req, res) => {
  res.render('pages/preinicio'); // Renderiza views/preinicio.ejs
});

app.get('/registroUsuario', (req, res) => {
  res.render('pages/registroUsuario'); // Renderiza views/pages/contacto.ejs
});


// Puerto y servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// ...existing code...

//BACKEND MERCADOPAGO
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configuración de Mercado Pago

const client = new MercadoPagoConfig({ accessToken: 'TEST-6644854260003021-062223-8d2ea44b8657c6e5f62183eed748c331-233977689' });
const payment = new Payment(client);

// ...existing code...

const { Preference } = require('mercadopago');

// Ruta para crear un preferenceId
app.post('/create_preference', express.json(), async (req, res) => {
  try {
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            title: "Compra en Farmacias Nigeria",
            quantity: 1,
            unit_price: Number(req.body.amount) || 10000,
            currency_id: "CLP"
          }
        ]
      }
    });
    res.json({ preferenceId: preference.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear el preferenceId', details: error.message });
  }
});