import UserController from '#controllers/UserController'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

// Agrupar rutas de usuario bajo '/users' y proteger con 'auth'
router.group(() => {
  //ruta para obtener los usuarios de la empresa
  router.get('/company/users', [UserController, 'getUsersByCompany'])
  // Crear usuario
  router.post('/company/users', [UserController, 'createUserForCompany'])
  // Actualizar usuario
  router.put('/company/users/:id', [UserController, 'updateUserForCompany'])
  // Eliminar usuario
  router.delete('/company/users/:id', [UserController, 'deleteUserForCompany'])
  // Obtener detalle de usuario por UUID
  router.get('/company/users/:id', [UserController, 'getUserDetail'])

  // Ruta para crear usuario en una unidad residencial
  //router.post('/unidad-residencial/:unidadResidencialId/users', [UserController, 'createUserForUnidadResidencial'])
}).prefix('/users').middleware([middleware.auth()])

export default router
