import router from '@adonisjs/core/services/router'
import CompanyController from '#controllers/CompanyController'
import FileController from '#controllers/FileController'

// Ruta para servir los logos
router.get('/uploads/logos/:filename', [FileController, 'serveLogo'])

// Rutas para gestión de empresas
router.group(() => {
  // Obtener empresa por ID
  router.get('/:id', [CompanyController, 'show'])
  
  // Obtener empresa por email
  router.get('/email/:email', [CompanyController, 'getByEmail'])
  
  // Listar empresas con paginación y filtros
  router.get('/', [CompanyController, 'index'])
  
  // Actualizar empresa
  router.put('/:id', [CompanyController, 'update'])
  
  // Subir logo de empresa
  router.post('/:id/logo', [CompanyController, 'uploadLogo'])
  
}).prefix('/companies')
