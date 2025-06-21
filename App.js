const express = require('express');
const path = require('path');

const app = express();

// Configurar motor de plantillas
app.set('view engine', 'ejs');

// Carpeta donde express buscara las vistas 
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'Public')));

// Ruta principal
app.get('/', (req, res) => {
  res.render('pages/index'); // Renderiza views/pages/index.ejs
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
