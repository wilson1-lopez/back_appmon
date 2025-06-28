import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_usuarios'

  async up() {
    // Actualizar usuarios existentes para asignarles la empresa basándose en el email
    await this.db.rawQuery(`
      UPDATE cf_usuarios 
      SET empresa_id = am_empresas.id 
      FROM am_empresas 
      WHERE cf_usuarios.correo = am_empresas.correo
      AND cf_usuarios.empresa_id IS NULL
    `)
  }

  async down() {
    // Revertir los cambios poniendo empresa_id en NULL
    await this.db.rawQuery(`
      UPDATE cf_usuarios 
      SET empresa_id = NULL 
      WHERE empresa_id IS NOT NULL
    `)
  }
}
