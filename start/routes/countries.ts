
import CountriesController from '#controllers/CountriesController'
import router from '@adonisjs/core/services/router'

// Rutas de países
router.post('/countries', [CountriesController, 'store'])
router.post('/countries/bulk', [CountriesController, 'bulkStore'])
router.get('/countries', [CountriesController, 'index'])
router.get('/countries/:id/document-options', [CountriesController, 'countryWithDocumentOptions'])
