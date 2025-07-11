import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_personas'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('foto_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('foto_url')
    })
  }
}
