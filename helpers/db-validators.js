const Role = require('../models/role')
const {User, Categoria, Producto} = require('../models')

const esRoleValido = async (role = '') => {
    const exiteRol = await Role.findOne({role})
    if(!exiteRol){
            throw new Error(`El role ${role} no está registrado en la Base de Datos`)
    }
}

const emailExiste = async (email = '') => {
    //verificar si el correo existe
    const existeEmail = await User.findOne({email})
    if (existeEmail) {
        throw new Error(`El correo: ${email}, ya existe`)
    }
}

const userPorIdExiste = async (id) => {
    //verificar si el correo existe
    const existeUser = await User.findById(id)
    if (!existeUser) {
        throw new Error(`El id: ${id}, no existe`)
    }
}

const categoriaPorIdExiste = async (id) => {
    //verificar si la categoria existe
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`El id: ${id}, no existe`)
    }
}

const productoPorIdExiste = async (id) => {
    //verificar si el producto existe
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`El id: ${id}, no existe`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if (!incluida) {
        throw new Error(`La colección ${coleccion}, no es permitida, ${colecciones}`)
    }
    return true
}

module.exports = {
    esRoleValido,
    emailExiste,
    userPorIdExiste,
    categoriaPorIdExiste,
    productoPorIdExiste,
    coleccionesPermitidas
}