import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_ciudades'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('dane_codigo', 5).notNullable().unique()
      table.string('nombre', 60).notNullable()
      table.integer('departamento_id').unsigned().notNullable()

      table.unique(['id', 'departamento_id'], 'uq_ciudades_id_departamento_id')
      table.foreign('departamento_id').references('id').inTable('am_departamentos').onDelete('RESTRICT')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
