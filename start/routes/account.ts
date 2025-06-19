import AccountActivationController from '#controllers/AccountActivationController'
import router from '@adonisjs/core/services/router'

// Rutas de activación y gestión de cuentas
router.get('/account-activation', [AccountActivationController, 'activate'])
router.post('/account/resend-activation', [AccountActivationController, 'resend'])
