import AptoController from '#controllers/AptoController'
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

router.group(() => {
  // CRUD básico
  router.get('/', [AptoController, 'index'])
  router.post('/', [AptoController, 'store'])
  router.get('/:id', [AptoController, 'show'])
  router.put('/:id', [AptoController, 'update'])
  router.delete('/:id', [AptoController, 'destroy'])
  
  // Rutas específicas
  router.get('/torre-bloque/:torreBloqueId', [AptoController, 'byTorreBloque'])
  router.get('/stats/general', [AptoController, 'stats'])
  router.patch('/:id/toggle-alquiler', [AptoController, 'toggleAlquiler'])
  router.patch('/:id/toggle-factura-digital', [AptoController, 'toggleFacturaDigital'])
}).prefix('/api/apartamentos').middleware([middleware.auth()])
