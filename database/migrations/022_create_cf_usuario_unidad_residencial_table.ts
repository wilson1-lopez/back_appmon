import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_usuario_unidad_residencial'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('usuario_id').notNullable()
      table.uuid('unidad_residencial_id').notNullable()
      table.primary(['usuario_id', 'unidad_residencial_id'])
      table.foreign('usuario_id').references('id').inTable('cf_usuarios').onDelete('RESTRICT')
      table.foreign('unidad_residencial_id').references('id').inTable('am_unidad_residencial').onDelete('RESTRICT')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
