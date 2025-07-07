import RoleController from '#controllers/RoleController'
import router from '@adonisjs/core/services/router'


router.get('/roles', [RoleController, 'index'])
