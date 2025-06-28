import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_usuarios'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('empresa_id').nullable().after('estado')
      table.foreign('empresa_id').references('id').inTable('am_empresas').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['empresa_id'])
      table.dropColumn('empresa_id')
    })
  }
}
