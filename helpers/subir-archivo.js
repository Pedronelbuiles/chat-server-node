const path = require('path')
const { v4: uuidv4 } = require('uuid')

const subirArchivo  = (files, extValidas = ['jpg', 'png', 'jpeg', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const extDelArchivo = archivo.name.split('.')
        const extension = extDelArchivo[extDelArchivo.length - 1]

        if (!extValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida | ${extValidas}`)
        }

        const nombreTemporal = uuidv4() + '.' + extension
    
        const uploadPath = path.join(__dirname,'../uploads/', carpeta, nombreTemporal);
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }

            resolve(nombreTemporal)
    
        });
    })
}

module.exports = {
    subirArchivo
}