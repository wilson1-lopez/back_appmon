import router from '@adonisjs/core/services/router'
import VisitanteController from '../../app/controllers/VisitanteController.js'

import { middleware } from '../kernel.js'

router.group(() => {
  router.post('/', [VisitanteController, 'registrar'])
  router.get('/unidad/:unidad_residencial_id', [VisitanteController, 'listarPorUnidad'])
}).prefix('/visitantes').middleware([middleware.auth()])
