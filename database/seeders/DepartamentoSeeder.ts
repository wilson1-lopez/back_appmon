import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: Department } = await import('#models/Department')
    

    await Department.createMany([
      
      {
        daneCode: '05',
        name: 'Antioquia',
        countryId: 1
      },
      {
        daneCode: '11',
        name: 'Cundinamarca',
        countryId: 1
      },
      {
        daneCode: '15',
        name: 'Lima',
        countryId: 3
      }
    ])
  }
}