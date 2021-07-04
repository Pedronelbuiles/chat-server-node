
const validarCampos = require('../middlewares/validar-campos')
const validarJWT = require('../middlewares/validar-jsonwebtoken')
const validarRoles = require('../middlewares/validar-roles')
const validarArchivo = require('../middlewares/validar-archivo')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo
}