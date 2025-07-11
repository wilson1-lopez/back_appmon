import PropietarioController from '#controllers/PropietarioController'
import FileController from '#controllers/FileController'
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

// Ruta pública para servir fotos (sin autenticación)
router.get('/uploads/fotos/:filename', [FileController, 'serveFoto'])

router.group(() => {
  // CRUD básico
  router.post('/', [PropietarioController, 'store'])
  router.get('/:id', [PropietarioController, 'show'])
  router.put('/:id', [PropietarioController, 'update'])
  router.delete('/:id', [PropietarioController, 'destroy'])
  
  // Rutas específicas
  router.get('/apartamento/:apartamentoId', [PropietarioController, 'getByApartamento'])
  router.post('/asociar-apartamento', [PropietarioController, 'asociarApartamento'])
  router.delete('/desasociar-apartamento', [PropietarioController, 'desasociarApartamento'])
  
  // Subida de foto
  router.post('/:id/foto', [PropietarioController, 'uploadFoto'])
}).prefix('/api/propietarios').middleware([middleware.auth()])
