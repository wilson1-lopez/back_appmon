import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: Role } = await import('#models/Role')
    
    await Role.createMany([
      {
        name: 'Administrador',
        description: 'Acceso total al sistema'
      },
      {
        name: 'Supervisor',
        description: 'Acceso limitado con permisos de gestión'
      },
      {
        name: 'Usuario',
        description: 'Acceso básico solo lectura'
      }
    ])
  }
}