const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    codigoSKU: {
        type: String,
        required: [true, 'El código SKU es obligatorio'],
        unique: true,
        uppercase: true,
        match: [/^[A-Z]{3}-\d{3}$/, 'El código SKU debe tener el formato: tres letras, un guion, y tres números (Ej: TEC-001)']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser un número negativo']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        default: 0,
        min: [0, 'El stock no puede ser negativo'],
        validate: {
            validator: Number.isInteger,
            message: 'El stock debe ser un número entero'
        }
    },
    categoria: {
        type: String,
        enum: {
            values: ['PERIFERICOS', 'MONITORES', 'COMPONENTES', 'ACCESORIOS'],
            message: 'La categoría debe ser PERIFERICOS, MONITORES, COMPONENTES o ACCESORIOS'
        }
    },
    estadoActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);
