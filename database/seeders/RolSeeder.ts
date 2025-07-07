import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'


export default class extends BaseSeeder {
  async run() {
    const { default: Role } = await import('#models/Role')

    // Obtener tipos de negocio existentes
    const empresaType = await db.from('am_tipos_negocio').where('codigo', 'EMPRESA').first()
    const residencialType = await db.from('am_tipos_negocio').where('codigo', 'RESIDENCIAL').first()

    if (!empresaType || !residencialType) {
      console.log('Tipos de negocio no encontrados. Asegúrate de ejecutar primero el seeder de tipos de negocio.')
      return
    }

    // Roles de empresa
    await Role.createMany([
      {
        name: 'Administrador',
        description: 'Acceso total al sistema',
        tipoNegocioId: empresaType.id
      },
      {
        name: 'Asistente',
        description: 'Soporte administrativo',
        tipoNegocioId: empresaType.id
      },
      {
        name: 'Supervisor',
        description: 'Acceso limitado con permisos de gestión',
        tipoNegocioId: empresaType.id
      }
    ])

    // Roles de unidad residencial
    await Role.createMany([
      {
        name: 'Vigilante',
        description: 'Control de acceso y seguridad',
        tipoNegocioId: residencialType.id
      },
      {
        name: 'Residente',
        description: 'Residente de la unidad',
        tipoNegocioId: residencialType.id
      },
      {
        name: 'Propietario',
        description: 'Propietario de la unidad',
        tipoNegocioId: residencialType.id
      },
      {
        name: 'Consejo',
        description: 'Miembro del consejo de administración',
        tipoNegocioId: residencialType.id
      }
    ])
  }
}