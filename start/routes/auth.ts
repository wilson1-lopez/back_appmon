import AuthController from '#controllers/AuthController'
import UserController from '#controllers/UserController'
import router from '@adonisjs/core/services/router'


// Rutas de autenticación y registro
router.post('/login', [AuthController, 'login'])
router.post('/register/company', [UserController, 'registerCompany'])

// Recuperación de contraseña
router.post('/auth/request-password-reset', [AuthController, 'requestPasswordReset'])
router.post('/auth/reset-password', [AuthController, 'resetPassword'])

// Login con Google
router.post('/auth/google-login', [AuthController, 'googleLogin'])
