import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: Country } = await import('#models/Country')
    
    await Country.createMany([
      {
        name: 'Colombia',
        internationalCode: 'CO',
        countryIcon: '🇨🇴'
      },
      {
        name: 'México',
        internationalCode: 'MX',
        countryIcon: '🇲🇽'
      },
      {
        name: 'Perú',
        internationalCode: 'PE',
        countryIcon: '🇵🇪'
      }
    ])
  }
}