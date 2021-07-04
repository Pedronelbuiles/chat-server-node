require('colors')
const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log('Base de datos online'.green);

    } catch (error) {
        console.log(error)
        throw new Error('Error al iniciar la base de datos'.red)
    }
}

//Se debe cerrar la conección a la base de datos despues de obtener los datos y mostrarlos
 //Esto con el fin de asegurarnos de que todas la conecciones que se habran a la base de datos se cierren de manera correcta
const dbCloseConnection = async () => {
    try {
        await mongoose.connection.close()

        console.log('Conección a la base de datos cerrada');
    } catch (error) {
        console.log(error)
        throw new Error('Error al cerrar la base de datos'.red)
    }
}

module.exports = {
    dbConnection,
    dbCloseConnection
}