import VehiculoAptoController from '#controllers/VehiculoAptoController'
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router.group(() => {
  // CRUD básico
  router.get('/', [VehiculoAptoController, 'index'])
  router.post('/', [VehiculoAptoController, 'store'])
  router.get('/:id', [VehiculoAptoController, 'show'])
  router.put('/:id', [VehiculoAptoController, 'update'])
  router.delete('/:id', [VehiculoAptoController, 'destroy'])
  
  // Rutas específicas
  router.get('/apartamento/:apartamentoId', [VehiculoAptoController, 'byApartamento'])
  router.get('/stats/general', [VehiculoAptoController, 'estadisticas'])
}).prefix('/api/vehiculos-apartamento').middleware([middleware.auth()])
