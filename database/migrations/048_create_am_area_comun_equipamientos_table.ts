import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_area_comun_equipamientos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_area_comun').notNullable()
      table.uuid('id_tipo_equipamiento').notNullable()
      table.integer('cantidad').defaultTo(1)
      
      table.primary(['id_area_comun', 'id_tipo_equipamiento'])
      table.foreign('id_area_comun').references('id').inTable('am_areas_comunes').onDelete('CASCADE')
      table.foreign('id_tipo_equipamiento').references('id').inTable('am_tipos_equipamiento').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
