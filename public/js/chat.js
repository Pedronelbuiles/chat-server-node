
let usuario = null
let sockets = null

const txtUid = document.querySelector('#txtUid')
const txtMesaje = document.querySelector('#txtMesaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')

const url = (window.location.hostname.includes('localhost') 
? 'http://localhost:8080/api/auth/'
: 'https://restserver-node-pedro-builes.herokuapp.com/api/auth/')

const validarJWT = async () => {
    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: {'Authorization-x-token': token}
    })
    
    const { usuario: userDB, token: tokenDB } = await resp.json()
    //renovar el token
    localStorage.setItem('token', tokenDB)
    usuario = userDB

    document.title = usuario.nombre

    await conectarSocket()

}

const conectarSocket = async () => {
    sockets = io({
        'extraHeaders': {
            'authorization-x-token': localStorage.getItem('token')
        }
    })

    sockets.on('connect', () => {
        console.log('Socket online');
    })

    sockets.on('disconnect', () => {
        console.log('Socket offline');
    })

    sockets.on('recibir-mensajes', dibujarMensajes)

    sockets.on('usuarios-activos', dibujarUsuarios)

    sockets.on('mensajes-privados',  (payload) => {
        console.log('privado: ', payload);
    })
}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = ''
    usuarios.forEach(({nombre, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    })
    ulUsuarios.innerHTML = usersHtml
}

const dibujarMensajes = (mensajes = []) => {
    let msgHtml = ''
    mensajes.forEach(({nombre, mensaje}) => {
        msgHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `
    })
    ulMensajes.innerHTML = msgHtml
}

txtMesaje.addEventListener('keyup', ({keyCode}) => {
    const mensaje = txtMesaje.value
    const uid = txtUid.value

    if (keyCode !== 13) return;
    if (mensaje.length == 0) return;

    sockets.emit('enviar-mensaje', { mensaje, uid })

    txtMesaje.value = ''

})

const main = async () => {

    await validarJWT()

}

main()

