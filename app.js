require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB (Local o Atlas)
// Por defecto conecta a localhost, para usar Atlas configura MONGODB_URI en un archivo .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/programacion_iv_sala7';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB exitosamente.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Importar rutas (comentado hasta que se creen las rutas)
// const productosRoutes = require('./routes/productos');
// app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Programación IV Sala7');
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
