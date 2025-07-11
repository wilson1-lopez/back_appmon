import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TipoVehiculo from '#models/TipoVehiculo'

export default class extends BaseSeeder {
  async run() {
    // Verificar si ya existen tipos de vehículos
    const existingTypes = await TipoVehiculo.all()
    
    if (existingTypes.length === 0) {
      await TipoVehiculo.createMany([
        {
          codigo: 'AUTO',
          nombre: 'Automóvil'
        },
        {
          codigo: 'MOTO',
          nombre: 'Motocicleta'
        },
        {
          codigo: 'BICI',
          nombre: 'Bicicleta'
        },
        {
          codigo: 'CAMION',
          nombre: 'Camión'
        },
        {
          codigo: 'VAN',
          nombre: 'Van'
        },
        {
          codigo: 'SUV',
          nombre: 'SUV'
        },
        {
          codigo: 'PICKUP',
          nombre: 'Pickup'
        },
        {
          codigo: 'BUS',
          nombre: 'Bus'
        }
      ])
    }
  }
}
