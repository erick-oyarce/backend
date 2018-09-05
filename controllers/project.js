'use strict'

var Project = require('../models/project');

var controller = {
	home: function(req, res){
		return res.status(200).send({
			message: 'Soy la home'
		});
	},
	//pruebas de solicitudes
	test: function(req, res){
		return res.status(200).send({
			message: 'Soy el metodo o accion del test controlador de project'
		});
	},

	saveProject: function(req, res){
		var project = new Project();

		//captura parametros del body de la web
		var params = req.body;

		//asignar valores al modelo creado
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = null;

		//almacenar el documento en la base de datos
		project.save((err, projectStored)=>{
			//condicion de error
			if(err) return res.status(500).send({message:'Error al guardar el documento'});

			//condicion si no se ha guardado la informacion
			if(!projectStored) return res.status(404).send({message: 'No se a podido guardar el projecto'});

			//retorna algo si todo es correcto
			return res.status(200).send({project: projectStored});
		});

	},

	//solicitar datos de la bd en base al id

	getProject: function(req, res){
		var projectId = req.params.id;

		if(projectId == null) return res.status(404).send({menssage: "El projecto no existe"});

		Project.findById(projectId, (err, project)=>{
			if(err) return res.status(500).send({menssge: "Error al devolver los datos"});

			if(!project) return res.status(404).send({menssage: "El projecto no existe"});

			return res.status(200).send({
				project
			});
		});
	},

	//metodo para obtener todos los projectos de la bd
	getProjects: function(req, res){

		//puede enviarse de parametro una condición para busqueda
		//devolvera todos los projectos en base a esa condicion
		//Project.find({year: 2018}).exec((err, projects)=>{

		//se pueden solicitar todos los datos si no existe condición	
		//Project.find({}).exec((err, projects)=>{

		//es posible solicitar un orden en el rotorno de datos con "sort"
		//en este caso se utiliza el año, al agregar el "-" se ordenan de mayor a menor
		Project.find({}).sort('-year').exec((err, projects)=>{

			if(err) return res.status(500).send({message: "Error al devolver datos"});

			if(!projects) return res.status(404).send({message: "No hayprojectos que mostrar"});

			return res.status(200).send({projects});

		});
	},

	//metodo para actualizar un projecto

	updateProject: function(req, res){
		var projectId = req.params.id;
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated)=>{

			if(err) return res.status(500).send({message: "Error al actualizar"});

			if(!projectUpdated) return res.send(404).send({message: "No existe el projecto para actualizar"});

			return res.status(200).send({ 
				project: projectUpdated
			});
		});
	},

	//metodo para borrar un projecto
	deleteProject: function(req,res){
		var projectId = req.params.id;

		Project.findByIdAndDelete(projectId, (err, projectRemove)=>{
			if(err) return res.status(500).send({menssage: "No se ha podido borrar el documento"});

			if(!projectRemove) return res.status(404).send({menssage:"No se puede eliminar ese projecto"});

			return res.status(200).send({
				project: projectRemove
			});
		});

	},

	//subir imagenes al servidor
	uploadImage: function(req, res){
		var projectId = req.params.id;
		var fileName = 'Imagen no subida';

		if(req.files){
			var filePath = req.files.image.path;
			var fileSplit = filePath.split('\\');
			var filenName = fileSplit[1];

			Project.findByIdAndUpdate(projectId, {image: fileName}, {new: true}, (err, projectUpdated)=>{
				if(err) return res.status(500).send({menssage: "La imagen no se ha subido"});

				if(!projectUpdated) return res.status(404).send({menssage:"El projecto no existe"});

				return res.status(200).send({
				project: projectUpdated
			});
		});

			
		}else{
			return res.status(200).send({
				message: fileName
			});

		}
	}
};

module.exports = controller;