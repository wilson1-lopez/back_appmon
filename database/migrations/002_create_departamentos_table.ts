import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_departamentos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('dane_codigo', 5).notNullable().unique()
      table.string('nombre', 60).notNullable().unique()
      table.integer('pais_id').unsigned().notNullable()

      table.unique(['id', 'pais_id'], 'uq_departamentos_id_pais_id')
      table.foreign('pais_id').references('id').inTable('am_paises').onDelete('RESTRICT')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
