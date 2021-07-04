const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias')
const { categoriaPorIdExiste } = require('../helpers/db-validators')

const router = Router()

//Obtener todas las categorias - get
router.get('/', obtenerCategorias)

//Obtener una categoria por id - get
router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(categoriaPorIdExiste),
    validarCampos
], obtenerCategoria)

//Crear categoria - privado - cualquier persona con un token valido - post
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//Actualizar un registro por id - privado -cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(categoriaPorIdExiste),
    validarCampos
], actualizarCategoria)

//Borrar una categoria - privado - solo administrador
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(categoriaPorIdExiste),
    validarCampos
], borrarCategoria)


router.get('/', (req,res) => {
    res.json('Todo ok')
})



module.exports = router