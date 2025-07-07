import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_apto'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('torre_bloque_id').notNullable()
      table.string('numero_apto', 20).notNullable()
      table.string('nro_parqueadero', 20).nullable()
      table.decimal('coeficiente', 10, 8).nullable()
      table.string('numero_cuarto_util', 20).nullable()
      table.string('area_libre', 20).nullable()
      table.decimal('coe_apto', 10, 8).nullable()
      table.decimal('coe_parqueadero', 10, 8).nullable()
      table.decimal('coe_cuarto_util', 10, 8).nullable()
      table.decimal('coe_area_libre', 10, 8).nullable()
      table.boolean('factura_digital').defaultTo(false)
      table.integer('estado_id').unsigned().notNullable()
      table.boolean('alquilado').defaultTo(false)
      table.uuid('agencia_id').nullable()
      
      table.foreign('torre_bloque_id').references('id').inTable('am_torre_bloque').onDelete('RESTRICT')
      table.foreign('estado_id').references('id').inTable('am_estado_apto').onDelete('RESTRICT')
      table.foreign('agencia_id').references('id').inTable('am_agencias').onDelete('SET NULL')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
