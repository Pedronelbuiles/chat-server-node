const { response, request } = require("express")


const esAdminRole = (req = request, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            message: 'Se queire verificar el role sin validar el token primero'
        })
    }

    const { role, nombre } = req.usuario

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `${nombre} no es administrador - No puede realizar esta acción`
        })
    }

    next()
}

const tieneRole = ( ...roles ) => {
    return (req = request, res = response, next) => {
        if(!req.usuario){
            return res.status(500).json({
                message: 'Se queire verificar el role sin validar el token primero'
            })
        }

        if(!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                message: `El servicio require uno de estos roles ${roles}`
            })
        }
        
        next()
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}