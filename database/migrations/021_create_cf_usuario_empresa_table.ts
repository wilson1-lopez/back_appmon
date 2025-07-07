import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_usuario_empresa'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('usuario_id').notNullable()
      table.uuid('empresa_id').notNullable()
      table.primary(['usuario_id', 'empresa_id'])
      table.foreign('usuario_id').references('id').inTable('cf_usuarios').onDelete('RESTRICT')
      table.foreign('empresa_id').references('id').inTable('am_empresas').onDelete('RESTRICT')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
