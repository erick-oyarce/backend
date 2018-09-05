'use strict'

//se obtienen los datos para generar un servidor
var express = require('express');

//se accede a los controladores
var ProjectController = require('../controllers/project');

//se genera un servidor local
var router = express.Router();

//middleware, se ejecuta antes de la ejecución del controlador
var multipart = require('connect-multiparty');

var multipartMiddleware = multipart({uploadDir: './uploads'});


//Rutas a utilizar para acceder a los controladores
router.get('/home', ProjectController.home);

router.post('/test', ProjectController.test);

router.post('/save-project', ProjectController.saveProject);

//el "id?" indica que asignar un id al url es opcional
router.get('/project/:id?', ProjectController.getProject);

router.get('/projects', ProjectController.getProjects);

router.put('/project/:id', ProjectController.updateProject);

router.delete('/project/:id', ProjectController.deleteProject);

router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);

module.exports = router;