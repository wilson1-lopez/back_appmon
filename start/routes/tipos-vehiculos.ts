import router from '@adonisjs/core/services/router'
import TipoVehiculoController from '#controllers/TipoVehiculoController'

router.group(() => {
  // Obtener todos los tipos de vehículos
  router.get('/', [TipoVehiculoController, 'index'])
  
  // Obtener un tipo de vehículo por ID
  router.get('/:id', [TipoVehiculoController, 'show'])
  
  // Crear un nuevo tipo de vehículo
  router.post('/', [TipoVehiculoController, 'store'])
  
  // Actualizar un tipo de vehículo
  router.put('/:id', [TipoVehiculoController, 'update'])
  
  // Eliminar un tipo de vehículo
  router.delete('/:id', [TipoVehiculoController, 'destroy'])
}).prefix('/api/tipos-vehiculos')
