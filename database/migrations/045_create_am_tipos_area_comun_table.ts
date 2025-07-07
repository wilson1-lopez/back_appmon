import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_tipos_area_comun'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.text('nombre').notNullable()
      table.text('descripcion').nullable()
      table.boolean('es_global').defaultTo(true)
      table.uuid('id_unidad_residencial').nullable()
      
      table.foreign('id_unidad_residencial').references('id').inTable('am_unidad_residencial').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
