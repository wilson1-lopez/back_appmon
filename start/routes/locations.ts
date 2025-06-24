import LocationController from '#controllers/LocationController'
import router from '@adonisjs/core/services/router'

// Rutas para ubicaciones geográficas
router.group(() => {
  // Obtener todos los países
  router.get('/countries', [LocationController, 'getCountries'])
  
  // Obtener departamentos por país
  router.get('/countries/:countryId/departments', [LocationController, 'getDepartmentsByCountry'])
  
  // Obtener ciudades por departamento
  router.get('/departments/:departmentId/cities', [LocationController, 'getCitiesByDepartment'])
  
  // Obtener jerarquía completa de un país (país -> departamentos -> ciudades)
  router.get('/countries/:countryId/hierarchy', [LocationController, 'getCompleteHierarchy'])
}).prefix('/api/locations')
