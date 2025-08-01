import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_residentes_x_apto'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('apartamento_id').notNullable()
      table.uuid('residente_id').notNullable()
      
      table.foreign('apartamento_id').references('id').inTable('am_apto').onDelete('CASCADE')
      table.foreign('residente_id').references('id').inTable('am_personas').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
