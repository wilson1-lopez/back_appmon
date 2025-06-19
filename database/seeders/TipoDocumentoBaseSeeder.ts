import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: BaseDocumentType } = await import('#models/BaseDocumentType')
    
    await BaseDocumentType.createMany([
      {
        code: 'nit',
        name: 'NIT'
      },
      {
        code: 'cedula_ciudadania',
        name: 'Cédula de Ciudadanía'
      },
      {
        code: 'rfc',
        name: 'RFC'
      },
      {
        code: 'dni',
        name: 'DNI'
      },
      {
        code: 'pasaporte',
        name: 'Pasaporte'
      }
    ])
  }
}