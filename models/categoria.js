
const { Schema, model } = require('mongoose')

const CategoriaSchema = Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true},
    status: { type: Boolean, default: true , required: true},
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

CategoriaSchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject()
    return data
}

module.exports = model('Categoria', CategoriaSchema)