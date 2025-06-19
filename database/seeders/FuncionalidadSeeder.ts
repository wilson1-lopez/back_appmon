import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: Feature } = await import('#models/Feature')
    
    await Feature.createMany([
      {
        name: 'Gestionar Empresas',
        description: 'Administrar datos de empresas'
      },
      {
        name: 'Gestionar Usuarios',
        description: 'Crear y modificar usuarios'
      },
      {
        name: 'Ver Reportes',
        description: 'Visualización de reportes y métricas'
      }
    ])
  }
}