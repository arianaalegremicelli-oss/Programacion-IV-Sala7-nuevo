const Producto = require('../models/Producto');

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: productoGuardado });
    } catch (error) {
        // Mongoose lanza un ValidationError si las reglas fallan (ej: SKU mal formado)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Error de validación', detalles: error.message });
        }
        // Manejar error de código SKU duplicado (código 11000 en MongoDB)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El código SKU ya existe en la base de datos' });
        }
        res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
    }
};

// Obtener todos los productos (con filtro opcional por categoría)
const obtenerProductos = async (req, res) => {
    try {
        const { categoria } = req.query;
        let filtro = {};

        // Si el cliente envía la categoría por query string, la agregamos al filtro
        if (categoria) {
            filtro.categoria = categoria.toUpperCase(); // Por si el cliente lo envía en minúsculas
        }

        // Recomendación: generalmente no se quieren traer los productos eliminados lógicamente
        // filtro.estadoActivo = true; // (Opcional: descomentar si solo queremos traer los activos)

        const productos = await Producto.find(filtro);
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al obtener los productos', detalles: error.message });
    }
};

// Obtener un producto por su ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        // Manejar el caso donde el ID no tiene un formato válido de MongoDB
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Formato de ID inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
    }
};

// Actualizar un producto (precio, stock u otros datos permitidos)
const actualizarPrecioStock = async (req, res) => {
    try {
        const { id } = req.params;
        
        // options: new devuelve el documento actualizado, runValidators fuerza a que Mongoose valide las reglas (ej: min stock)
        const productoActualizado = await Producto.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }

        res.status(200).json({ mensaje: 'Producto actualizado exitosamente', producto: productoActualizado });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Error de validación al actualizar', detalles: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
    }
};

// Borrado lógico (Soft Delete)
const borradoLogico = async (req, res) => {
    try {
        const { id } = req.params;

        // No usamos findByIdAndDelete, sino que actualizamos estadoActivo a false
        const productoDesactivado = await Producto.findByIdAndUpdate(
            id,
            { estadoActivo: false },
            { new: true }
        );

        if (!productoDesactivado) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }

        res.status(200).json({ mensaje: 'Producto desactivado exitosamente', producto: productoDesactivado });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarPrecioStock,
    borradoLogico
};
