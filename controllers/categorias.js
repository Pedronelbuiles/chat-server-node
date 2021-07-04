const { response } = require("express")
const { Categoria } = require("../models")

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = {status: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}

//obtenerCategoria - populate
const obtenerCategoria = async (req, res = response) => {

    const {id} = req.params
    const categoria = await Categoria.findById(id).populate('usuario','nombre')

    res.json(categoria)

}

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase()

    try {
        const categoriaDB = await Categoria.findOne({nombre})

        if (categoriaDB) {
            return res.status(400).json({
                message: `La categoria ${categoriaDB.nombre}, ya existe`
            })
        }

        //Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        }

        const categoria = await new Categoria(data)
        await categoria.save()

        res.status(201).json(categoria)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Oops algo salio mal, por favor contacta con el administrador"
        })
    }
}

//ActualizarCategoria
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params
    const { status, usuario, ...data }  = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})
    res.json(categoria)
}

//borrarCategoria - solo admin
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {status: false},  {new: true})

    res.json(categoriaBorrada)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}