import TorreBloqueController from '#controllers/TorreBloqueController'
import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'


router.group(() => {
  router.get('/', [TorreBloqueController, 'index'])
  router.get('/:id', [TorreBloqueController, 'show'])
  router.post('/', [TorreBloqueController, 'store'])
  router.put('/:id', [TorreBloqueController, 'update'])
  router.delete('/:id', [TorreBloqueController, 'destroy'])
  router.get('/unidad/:unidadId', [TorreBloqueController, 'byUnidad'])
}).prefix('/api/torres-bloques').middleware([middleware.auth()])
