import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_pricing_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.text('title').notNullable()
      table.text('price').notNullable()
      table.text('description').nullable()
      table.text('is_popular').nullable()
      table.text('button_text').nullable()
      table.text('button_url').nullable()
      table.integer('order_index').notNullable()
      table.text('price_anual').nullable()
      table.integer('descuento').defaultTo(0)
      table.integer('tipo_negocio_id').unsigned().defaultTo(1)
      
      table.foreign('tipo_negocio_id').references('id').inTable('am_tipos_negocio').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}