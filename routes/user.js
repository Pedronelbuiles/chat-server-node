const { Router } = require('express')
const { check } = require('express-validator')

const {
        validarCampos,
        validarJWT,
        esAdminRole,
        tieneRole
} = require('../middlewares')

const { esRoleValido, emailExiste, userPorIdExiste } = require('../helpers/db-validators')

const { usersGet, 
        usersPut, 
        usersPost, 
        usersPatch, 
        usersDelete } = require('../controllers/users')

const router = Router()

router.get('/', usersGet)

router.put('/:id', [
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(userPorIdExiste),
        check('role').custom(esRoleValido),
        validarCampos
], usersPut)

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña debe ser de más de 6 letras').isLength({min: 6}),
        check('email', 'El email no es valido').isEmail(),
        check('email').custom(emailExiste),
        check('role').custom(esRoleValido),
        // check('role', 'No es un role valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        validarCampos
], usersPost)

router.delete('/:id', [
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(userPorIdExiste),
        validarCampos
], usersDelete)

router.patch('/', usersPatch)


module.exports = router