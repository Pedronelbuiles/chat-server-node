const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { User, Producto } = require('../models')

const cargarArchivo = async (req, res = response) => {
  
   try {
    const nombre = await subirArchivo(req.files, undefined, 'imgs')
    //txt,sql
    // const nombre = await subirArchivo(req.files, ['txt','md'], 'textos')

    res.json({
      nombre
    })
   } catch (message) {
     res.status(400).json({message})
   }
}

const actualizarArchivo = async (req, res = response) => {
  const { id, collection } = req.params

  let modelo

  switch (collection) {
    case 'usuarios':
      modelo = await User.findById(id)
      if (!modelo) {
        return res.status(400).json({
          message: `No existe el usuario con id ${id}`
        })
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          message: `No existe el producto con id ${id}`
        })
      }
      break;
  
    default:
      return res.status(500).json({message: 'Colección no validada'})
  }

  //limpiar imagenes previas
  try {
    if (modelo.img) {
      //borrae imagen del servidor
      const pathImage = path.join(__dirname, '../uploads', collection, modelo.img)
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
      }
    }
  } catch (message) {
    res.status(400).json({message})
  }

  modelo.img = await subirArchivo(req.files, undefined, collection)
  await modelo.save()

  res.json(modelo)
}

const mostrarImagen = async (req, res= response) => {
  const { id, collection } = req.params

  const pathNotFound = path.join(__dirname, '../assets/img/404.jpg')

  let modelo 

  switch (collection) {
    case 'usuarios':
      modelo = await User.findById(id)
      if (!modelo) {
        return res.status(400).json({
          message: `No existe el usuario con id ${id}`
        })
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          message: `No existe el producto con id ${id}`
        })
      }
      break;
  
    default:
      return res.status(500).json({message: 'Colección no validada'})
  }

  //limpiar imagenes previas
  try {
    if (modelo.img) {
      const pathImage = path.join(__dirname, '../uploads', collection, modelo.img)
      if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage)
      }
    }
  } catch (message) {
    res.status(500).json({message})
  }

  res.sendFile(pathNotFound)
}

const actualizarArchivoCloudinary = async (req, res = response) => {
  const { id, collection } = req.params

  let modelo

  switch (collection) {
    case 'usuarios':
      modelo = await User.findById(id)
      if (!modelo) {
        return res.status(400).json({
          message: `No existe el usuario con id ${id}`
        })
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          message: `No existe el producto con id ${id}`
        })
      }
      break;
  
    default:
      return res.status(500).json({message: 'Colección no validada'})
  }

  //limpiar imagenes previas
  try {
    if (modelo.img) {
      //borrae imagen del servidor cloudinary
      const nombreArr = modelo.img.split('/')
      const nombre =  nombreArr[nombreArr.length - 1]
      const [ public_id ] = nombre.split('.')
      cloudinary.uploader.destroy(public_id)
    }
  } catch (message) {
    res.status(400).json({message})
  }

  const { tempFilePath } = req.files.archivo
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

  modelo.img = secure_url
  await modelo.save()

  res.json(modelo)
}

module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen,
    actualizarArchivoCloudinary
}