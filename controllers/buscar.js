const { response } = require("express");
const { ObjectId } = require('mongoose').Types

const { User, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino)

    if (esMongoId) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: (categoria) ? [ categoria ] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({ nombre: regex, status: true })

    res.json({
        results: categorias
    })
}

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino)

    if (esMongoId) {
        const usuario = await User.findById(termino)
        return res.json({
            results: (usuario) ? [ usuario ] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const usuarios = await User.find({
        $or: [{ nombre: regex }, { email: regex }],
        $and: [{ status: true }]
    })

    res.json({
        results: usuarios
    })
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino)

    if (esMongoId) {
        const producto = await Producto.findById(termino)
                                .populate('categoria', 'nombre')
        return res.json({
            results: (producto) ? [ producto ] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({ nombre: regex, status: true })
                            .populate('categoria', 'nombre')

    res.json({
        results: productos
    })
}

const buscar = (req, res = response) => {

    const { collection, termino } = req.params

    if (!coleccionesPermitidas.includes(collection)) {
        return res.status(401).json({
            message: `${collection} no es una colección permitida`,
            coleccionesPermitidas: coleccionesPermitidas
        })
    }

    switch (collection) {
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
    
        default:
            res.status(500).json({
                message: 'Busqueda no desarrollada'
            })
            break;
    }
}

module.exports = {
    buscar
}