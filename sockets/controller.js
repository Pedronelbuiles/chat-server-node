const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models")

const chatMensajes = new ChatMensajes()

const socketController = async (socket = new Socket, io ) => {
    const usuario = await comprobarJWT(socket.handshake.headers['authorization-x-token'])

    if (!usuario) {
        return socket.disconnect()
    }

    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario)

    //emitir a todos los usuarios incluido el emisor (sin broadcast)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    //conectarlo a una sala especial
    socket.join(usuario.id)

    //limpiar cuando alguien se deconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if (uid) {
            // es un mensaje privado
            socket.to(uid).emit('mensajes-privados', {de: usuario.nombre, mensaje})
        }else {
            chatMensajes.enviarMensaje(usuario.id , usuario.nombre, mensaje)
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }

    })

}

module.exports = {
    socketController
}