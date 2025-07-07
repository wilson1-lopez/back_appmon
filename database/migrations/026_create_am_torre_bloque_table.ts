import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_torre_bloque'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
    table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.text('nombre').notNullable()
      table.integer('pisos').notNullable().unsigned()
      table.text('descripcion')
      table.uuid('unidad_id')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table
        .foreign('unidad_id')
        .references('id')
        .inTable('am_unidad_residencial')
        .onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
