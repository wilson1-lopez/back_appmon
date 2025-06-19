import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_tipos_documento'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('tipo_base_id').unsigned().notNullable()
      table.integer('pais_id').unsigned().notNullable()
      table.boolean('estado').defaultTo(true)
      
      table.unique(['tipo_base_id', 'pais_id'])
      table.foreign('tipo_base_id').references('id').inTable('am_tipos_documento_base').onDelete('RESTRICT')
      table.foreign('pais_id').references('id').inTable('am_paises').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}