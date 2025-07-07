import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_empresas'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Eliminar la FK actual
      table.dropForeign(['tipo_compania_id'])
      table.dropColumn('tipo_compania_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tipo_compania_id').unsigned().notNullable()
      table.foreign('tipo_compania_id').references('id').inTable('am_tipos_compania').onDelete('RESTRICT')
    })
  }
}
