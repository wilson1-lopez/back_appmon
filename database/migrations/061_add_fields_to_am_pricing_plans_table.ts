import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_pricing_plans'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('visible').defaultTo(true)
      table.boolean('activo').defaultTo(true)
      table.integer('storage_mb_empresa').defaultTo(0)
      table.integer('storage_mb_unidad').defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('visible')
      table.dropColumn('activo')
      table.dropColumn('storage_mb_empresa')
      table.dropColumn('storage_mb_unidad')
    })
  }
}
