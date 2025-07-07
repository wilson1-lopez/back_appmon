import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_roles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Primero eliminar la foreign key existente si existe
      table.dropForeign(['tipo_rol_id'])
      table.dropColumn('tipo_rol_id')
      
      // Agregar la nueva columna
      table.integer('tipo_negocio_id').unsigned().notNullable().defaultTo(1)
      table.foreign('tipo_negocio_id').references('id').inTable('am_tipos_negocio').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['tipo_negocio_id'])
      table.dropColumn('tipo_negocio_id')
      
      // Restaurar la columna anterior
      table.integer('tipo_rol_id').unsigned().nullable()
      table.foreign('tipo_rol_id').references('id').inTable('cf_tipo_rol').onDelete('RESTRICT')
    })
  }
}
