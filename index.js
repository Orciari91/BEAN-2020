const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const multer = require("multer")
const joi = require("@hapi/joi") //validar esquemas de datos // URL: https://github.com/hapijs/joi
const hbs = require('nodemailer-express-handlebars') //templates para mails. Tiene que estar escritos en html incluyendo los estilos sin usar css


/* INICIO configs nodemailer */

//1)configurar los datos del servidor de email
const miniOutlook = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'audra.kub86@ethereal.email',
        pass: 'jyA4vC3kJvBq22cfHM'
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
//3)Asignar motor de plantilla "Handlebars"
const render = {
	viewEngine: {
		layoutsDir: "template/", //carpeta donde se van a alojar las plantillas de mails
		partialsDir: "template/",
		defaultLayout: false,
		extName: ".hbs"
	}, 			//motor de la vista
	viewPath: "template/",	//Ruta de la vista
	extName: ".hbs", 		//Extension
}
miniOutlook.use("compile", hbs(render))


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

	

const schema = joi.object({
	nombre: joi.string().min(3).max(25).required(),
	correo: joi.string().email(
	{ 
		minDomainSegments: 2, 
		tlds: { 
			allow: ["com", "net", "org"] 
		} 
	}).required(),
	asunto: joi.string().alphanum().valid("ax45", "ax38", "ax67", "ax14").required(),
	mensaje: joi.string().min(50).max(200).required(),
	fecha: joi.date().timestamp('unix')
})

let validacion = schema.validate(datos.consulta)

if(validacion.error){
	response.json(validacion.error)
}
else
{
	miniOutlook.sendMail({
	from : datos.consulta.correo,
	to: "pablo.orciari@hotmail.com.ar",
	subject: datos.consulta.asunto,
	//html: "<strong>" + datos.consulta.mensaje + "</strong>"	
	template: "prueba",
	context : datos.consulta
	//implementar el sistema de plantilla hbs + envio del email https://www.npmjs.com/package/nodemailer-express-handlebars
}, function(error, info){

	let msg = error ? "Su consulta no pudo ser enviada" : "Gracias por su consulta" //operador ternario 

	response.json({msg})
	})
}

})

