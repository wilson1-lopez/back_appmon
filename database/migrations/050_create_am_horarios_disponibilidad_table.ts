import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_horarios_disponibilidad'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('id_area_comun').notNullable()
      table.smallint('id_dia_semana').notNullable()
      table.time('hora_inicio').notNullable()
      table.time('hora_fin').notNullable()
      table.boolean('cerrado').defaultTo(false)
      
      table.foreign('id_area_comun').references('id').inTable('am_areas_comunes').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
