import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_usuarios'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('telefono').notNullable().defaultTo('')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('telefono')
    })
  }
}
