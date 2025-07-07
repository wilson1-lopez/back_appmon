import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_fotos_area_comun'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('id_area_comun').notNullable()
      table.text('url_foto').notNullable()
      table.integer('orden').defaultTo(0)
      table.text('alt_text').nullable()
      
      table.foreign('id_area_comun').references('id').inTable('am_areas_comunes').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
