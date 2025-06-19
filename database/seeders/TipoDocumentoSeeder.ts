import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: DocumentType } = await import('#models/DocumentType')
    
    await DocumentType.createMany([
      // Colombia
      { baseTypeId: 1, countryId: 1 }, // NIT
      { baseTypeId: 2, countryId: 1 }, // Cédula ciudadanía
      { baseTypeId: 5, countryId: 1 }, // Pasaporte
      
      // México
      { baseTypeId: 3, countryId: 2 }, // RFC
      { baseTypeId: 5, countryId: 2 }, // Pasaporte
      
      // Perú
      { baseTypeId: 4, countryId: 3 }, // DNI
      { baseTypeId: 5, countryId: 3 }  // Pasaporte
    ])
  }
}