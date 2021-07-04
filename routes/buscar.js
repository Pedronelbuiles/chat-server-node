const { Router } = require('express')

const { buscar } = require('../controllers/buscar')

const router = Router()

router.get('/:collection/:termino', buscar)


module.exports = router