import router from '@adonisjs/core/services/router'
import UnidadResidencialController from '#controllers/UnidadResidencialController'
import FileController from '#controllers/FileController'
import { middleware } from '#start/kernel'

// Ruta para servir los logos de unidades residenciales
router.get('/uploads/unidades/:filename', [FileController, 'serveUnidadLogo'])

// Rutas protegidas para gestión de unidades residenciales
router.group(() => {
  // Obtener unidades residenciales asociadas a un usuario según su rol
  router.get('/unidades-por-usuario', [UnidadResidencialController, 'unidadesPorUsuario'])
  // Crear nueva unidad residencial
  router.post('/', [UnidadResidencialController, 'store'])
  
  // Listar unidades residenciales de la empresa
  router.get('/', [UnidadResidencialController, 'index'])
  
  // Listar todas las unidades residenciales de la empresa (sin paginación)
  router.get('/all', [UnidadResidencialController, 'all'])

  // Obtener unidad residencial por ID
  router.get('/:id', [UnidadResidencialController, 'show'])
  
  // Actualizar unidad residencial
  router.put('/:id', [UnidadResidencialController, 'update'])
  
  // Eliminar unidad residencial
  router.delete('/:id', [UnidadResidencialController, 'destroy'])
  
  // Subir logo de unidad residencial
  router.post('/:id/logo', [UnidadResidencialController, 'uploadLogo'])
  
}).prefix('/unidades-residenciales').middleware([middleware.auth()])
