import ResidenteController from '#controllers/ResidenteController'
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router.group(() => {
  // CRUD básico
  router.post('/', [ResidenteController, 'store'])
  router.post('/con-foto', [ResidenteController, 'storeWithFoto'])
  router.get('/:id', [ResidenteController, 'show'])
  router.put('/:id', [ResidenteController, 'update'])
  router.put('/:id/con-foto', [ResidenteController, 'updateWithFoto'])
  router.delete('/:id', [ResidenteController, 'destroy'])
  
  // Rutas específicas
  router.get('/apartamento/:apartamentoId', [ResidenteController, 'getByApartamento'])
  router.post('/asociar-apartamento', [ResidenteController, 'asociarApartamento'])
  router.delete('/desasociar-apartamento', [ResidenteController, 'desasociarApartamento'])
}).prefix('/api/residentes').middleware([middleware.auth()])
