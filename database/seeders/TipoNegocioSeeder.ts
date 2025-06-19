import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: BusinessType } = await import('#models/BusinessType')
    
    await BusinessType.createMany([
      {
        code: 'unidad_residencial',
        name: 'Unidad Residencial'
      },
      {
        code: 'comercial',
        name: 'Comercial'
      }
    ])
  }
}