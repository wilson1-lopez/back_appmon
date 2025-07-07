import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_vehiculos_x_apto'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('apartamento_id').notNullable()
      table.integer('tipo_id').unsigned().notNullable()
      table.text('placa').nullable()
      table.text('otro_tipo_descripcion').nullable()
      
      table.foreign('apartamento_id').references('id').inTable('am_apto').onDelete('CASCADE')
      table.foreign('tipo_id').references('id').inTable('am_tipos_vehiculo').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
