const jwt = require('jsonwebtoken')
const { User } = require('../models')

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = {uid}

        jwt.sign(payload, process.env.SECRET_OR_PUBLIC_KEY, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            }else{
                resolve(token)
            }
        })
    })
}

const comprobarJWT = async (token = '') => {
    try {
        if (token.length < 10) {
            return null
        }

        const { uid } = jwt.verify(token, process.env.SECRET_OR_PUBLIC_KEY)

        const usuario = await User.findById(uid)

        if (usuario) {
            if (usuario.status) {
                return usuario
            }else {
                return null
            }
        }else {
            return null
        }

    } catch (error) {
        return null
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}