import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_empresas'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Agregar campo tipo_compania como texto
      table.text('tipo_compania').notNullable().defaultTo('administradores')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tipo_compania')
    })
  }
}
