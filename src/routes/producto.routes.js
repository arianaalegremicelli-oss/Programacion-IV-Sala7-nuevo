const express = require('express');
const router = express.Router();

const {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarPrecioStock,
    borradoLogico
} = require('../controllers/producto.controller');

// POST /api/productos - Crear un producto
router.post('/', crearProducto);

// GET /api/productos - Obtener productos (acepta ?categoria=)
router.get('/', obtenerProductos);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', obtenerProductoPorId);

// PUT /api/productos/:id - Actualizar datos de un producto (precio, stock, etc)
router.put('/:id', actualizarPrecioStock);

// DELETE /api/productos/:id - Borrado lógico del producto
router.delete('/:id', borradoLogico);

module.exports = router;
