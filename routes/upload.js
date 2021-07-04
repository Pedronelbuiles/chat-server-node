const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarArchivo } = require('../middlewares')
const { cargarArchivo, mostrarImagen, actualizarArchivoCloudinary } = require('../controllers/upload')
const { coleccionesPermitidas } = require('../helpers/db-validators')

const router = Router()

router.post('/', validarArchivo, cargarArchivo)

router.put('/:collection/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarArchivoCloudinary)

router.get('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)


module.exports = router