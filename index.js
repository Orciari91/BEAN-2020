const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const multer = require("multer")

/* INICIO configs nodemailer */

//1)configurar los datos del servidor de email
const miniOutlook = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'armando.hagenes55@ethereal.email',
        pass: 'Ef1AUuZYgMqAQqeDV5'
    }
});

//2) Verificar conexion con el servidor de email
miniOutlook.verify(function(error, ok){

	if(error){ //<--Si fallo
		console.log("AHHH")
		console.log(error)

	} else { //<--Si salio bien
		console.log("Ready Player One")
	}

})

/* FIN de configs nodemailer */

const server = express()
const port = 80
const public = express.static("public")
const json = bodyParser.json()
const urlencoded = bodyParser.urlencoded({extended : false})
const upload = multer()


/* Buscar archivos estaticos en el directorio /public */
server.use(public)
server.use(json)
server.use(urlencoded)
server.use(upload.array())

server.listen(port)

/* Ejecutar endpoints customizados */
server.post("/enviar", function(request, response){
	let datos = {
		rta: "ok",
		consulta: request.body
	}

	//Validación INSTALAR MODULO JOI E IMPLEMENTARLO POR LOS IF's PARA VALIDAR ESQUEMA DE DATOS
	//URL: https://github.com/hapijs/joi

	if (datos.consulta.nombre == "" || datos.consulta.nombre == null || datos.consulta.nombre == undefined) {
		response.json({
			rta: "error",
			msg: "El nombre no puede quedar vacio"
		})
	}
	else if (datos.consulta.correo == "" || datos.consulta.correo.indexOf("@") == -1 || datos.consulta.correo == null || datos.consulta.correo == undefined)
	{
		response.json({
			rta: "error",
			msg: "Ingrese un correo valido"
		})
	}
	else if (datos.consulta.asunto == "" || datos.consulta.asunto == null || datos.consulta.asunto == undefined)
	{
		response.json({
			rta: "error",
			msg: "Elija un asunto"
		})	
	}
	else if (datos.consulta.mensaje.length < 50 || datos.consulta.mensaje.length > 200 || datos.consulta.mensaje == null || datos.consulta.mensaje == undefined)
	{
		response.json({
			rta: "error",
			msg: "Ingrese un mensaje entre 50 y 200 caracteres"
		})
	}
	else{
		//Envio de mail..
		miniOutlook.sendMail({
			from : datos.consulta.correo,
			to: "pablo.orciari@hotmail.com.ar",
			subject: datos.consulta.asunto,
			html: "<strong>" + datos.consulta.mensaje + "</strong>"
		})

		response.json(datos)
	}

})

