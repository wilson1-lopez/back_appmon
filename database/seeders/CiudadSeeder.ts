import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: City } = await import('#models/City')
    
    await City.createMany([
      {
        daneCode: '05001',
        name: 'Medellín',
        departmentId: 1
      },
      {
        daneCode: '11001',
        name: 'Bogotá',
        departmentId: 2
      },
      {
        daneCode: '15001',
        name: 'Lima',
        departmentId: 3
      }
    ])
  }
}