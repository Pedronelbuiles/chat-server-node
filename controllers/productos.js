const { response } = require("express")
const { Producto } = require("../models")

const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = {status: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

const obtenerProducto = async (req, res = response) => {

    const {id} = req.params
    const producto = await Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre')

    res.json(producto)

}

const crearProducto = async (req, res = response) => {
    const { status, usuario, ...body } = req.body

    try {
        const productoDB = await Producto.findOne({nombre: body.nombre})

        if (productoDB) {
            return res.status(400).json({
                message: `El producto ${productoDB.nombre}, ya existe`
            })
        }

        //Generar la data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }

        const producto = await new Producto(data)
        await producto.save()

        res.status(201).json(producto)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Oops algo salio mal, por favor contacta con el administrador"
        })
    }
}

const actualizarProducto = async (req, res = response) => {
    const { id } = req.params
    const { status, usuario, ...data }  = req.body

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
    res.json(producto)
}

//borrarCategoria - solo admin
const borrarProducto = async (req, res = response) => {
    const { id } = req.params
    const productoBorrada = await Producto.findByIdAndUpdate(id, {status: false},  {new: true})

    res.json(productoBorrada)
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}