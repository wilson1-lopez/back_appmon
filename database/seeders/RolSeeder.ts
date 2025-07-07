import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'


export default class extends BaseSeeder {
  async run() {
    const { default: Role } = await import('#models/Role')

    // Crear tipos de rol
    const [empresaId] = await db.table('cf_tipo_rol').insert({ nombre: 'Empresa', created_at: db.raw('CURRENT_TIMESTAMP'), updated_at: db.raw('CURRENT_TIMESTAMP') }).returning('id')
    const [unidadId] = await db.table('cf_tipo_rol').insert({ nombre: 'Unidad Residencial', created_at: db.raw('CURRENT_TIMESTAMP'), updated_at: db.raw('CURRENT_TIMESTAMP') }).returning('id')

    // Roles de empresa
    await Role.createMany([
      {
        name: 'Administrador',
        description: 'Acceso total al sistema',
        tipo_rol_id: empresaId.id || empresaId // compatibilidad con distintos drivers
      },
      {
        name: 'Asistente',
        description: 'Soporte administrativo',
        tipo_rol_id: empresaId.id || empresaId
      },
      {
        name: 'Supervisor',
        description: 'Acceso limitado con permisos de gestión',
        tipo_rol_id: empresaId.id || empresaId
      }
    ])

    // Roles de unidad residencial
    await Role.createMany([
      {
        name: 'Vigilante',
        description: 'Control de acceso y seguridad',
        tipo_rol_id: unidadId.id || unidadId
      },
      {
        name: 'Residente',
        description: 'Residente de la unidad',
        tipo_rol_id: unidadId.id || unidadId
      },
      {
        name: 'Propietario',
        description: 'Propietario de la unidad',
        tipo_rol_id: unidadId.id || unidadId
      },
      {
        name: 'Consejo',
        description: 'Miembro del consejo de administración',
        tipo_rol_id: unidadId.id || unidadId
      }
    ])
  }
}