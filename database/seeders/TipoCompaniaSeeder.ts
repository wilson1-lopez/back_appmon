import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: CompanyType } = await import('#models/CompanyType')
    
    await CompanyType.createMany([
      {
        code: 'administrador',
        name: 'Administrador'
      },
      {
        code: 'empresa_vigilancia',
        name: 'Empresa de Vigilancia'
      }
    ])
  }
}