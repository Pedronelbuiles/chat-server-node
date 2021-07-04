const { response } = require("express");
const bcryptjs = require('bcryptjs')

const User = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { email, password} = req.body

    try {
        //Verificar email
        const usuario = await User.findOne({ email })
        if (!usuario) {
            return res.status(400).json({
                message: 'Usuario / contraseña incorrecto -- correo'
            })
        }
        //Verificar usuario activo
        if (!usuario.status) {
            return res.status(400).json({
                message: 'Usuario / contraseña incorrecto -- estado: false'
            })
        }
        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                message: 'Usuario / contraseña incorrecto -- password'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({usuario, token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body

    try {

        const { nombre, img, email } = await googleVerify(id_token)

        let usuario = await User.findOne({email})
        if (!usuario) {
            //Crear usuario
            const data = {
                nombre,
                email,
                password: ':v',
                img,
                google: true
            }

            usuario = new User(data)
            await usuario.save()
        }

        //Si el usuario en DB esta inactivo
        if (!usuario.status) {
            return res.status(401).json({
                message: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el jwt
        const token = await generarJWT(usuario.id)
        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            message: 'Token de Google no es válido'
        })
    }

}

const renovarToken = async (req , res = response) => {
    const {usuario} = req

    const token = await generarJWT(usuario.id)

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}