import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_roles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tipo_rol_id').unsigned().nullable()
      table.foreign('tipo_rol_id').references('id').inTable('cf_tipo_rol').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['tipo_rol_id'])
      table.dropColumn('tipo_rol_id')
    })
  }
}
