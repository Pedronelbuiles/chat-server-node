const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('Authorization-x-token')

    if (!token) {
        return res.status(401).json({
            message: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PUBLIC_KEY)

        const usuario = await User.findById(uid)

        if(!usuario){
            return res.status(401).json({
                message: 'Token no válido -- usuario no existe en base de datos'
            })
        }

        //Verificar si el usuario tiene el status en treu
        if(!usuario.status){
            return res.status(401).json({
                message: 'Token no válido -- usuario con estado en false'    
            })
        }

        req.usuario = usuario
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}