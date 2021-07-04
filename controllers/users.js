const { response } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/usuario')

const usersGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = {status: true}

    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usersPost = async (req, res = response) => {
    
    const { nombre, email, password, role } = req.body
    const usuario = new User({ nombre, email, password, role })

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)

    //Guardar en base de datos
    await usuario.save()

    res.status(201).json(usuario)
}

const usersPut = async (req, res = response) => {

    const { id } = req.params
    const { _id, password, google, email, ...resto } = req.body

    //Validar contra la base de datos
    if(password) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await User.findByIdAndUpdate(id, resto, {new: true})

    res.status(400).json(usuario)
}

const usersPatch = (req, res = response) => {
    res.json({
        message: 'Hola Pedro. Eres el mejor. Desde el controlador',
        peticion:'PATCH'
    })
}

const usersDelete = async (req, res = response) => {
    const {id} = req.params

    //Obtener un elemento de la req que se guarda desde el middleware de validar jwt
    // const uid = req.uid

    //Borrado fisicamente
    // const usuario = await User.findByIdAndDelete(id)

    const usuario = await User.findByIdAndUpdate(id, {status: false})

    res.json(usuario)
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}