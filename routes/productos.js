const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos')

const { categoriaPorIdExiste, productoPorIdExiste } = require('../helpers/db-validators')

const router = Router()

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(productoPorIdExiste),
    validarCampos
], obtenerProducto)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de válido').isMongoId(),
    check('categoria').custom(categoriaPorIdExiste),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(productoPorIdExiste),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(productoPorIdExiste),
    validarCampos
], borrarProducto)


router.get('/', (req,res) => {
    res.json('Todo ok')
})



module.exports = router