import AgenciaController from '#controllers/AgenciaController'
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router.group(() => {
  // CRUD básico
  router.get('/', [AgenciaController, 'index'])
  router.post('/', [AgenciaController, 'store'])
  router.get('/all', [AgenciaController, 'all'])
  router.get('/search', [AgenciaController, 'search'])
  router.get('/stats', [AgenciaController, 'stats'])
  router.get('/:id', [AgenciaController, 'show'])
  router.put('/:id', [AgenciaController, 'update'])
  router.delete('/:id', [AgenciaController, 'destroy'])
  
  // Rutas específicas
  router.get('/:id/apartamentos', [AgenciaController, 'apartamentos'])
}).prefix('/api/agencias').middleware([middleware.auth()])
