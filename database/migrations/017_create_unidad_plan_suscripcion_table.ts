import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_unidad_plan_suscripcion'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('unidad_residencial_id').notNullable()
      table.uuid('plan_id').notNullable()
      table.timestamp('fecha_inicio').notNullable().defaultTo(this.now())
      table.timestamp('fecha_fin').nullable()
      table.text('estado').notNullable().defaultTo('activo')
      table.boolean('es_actual').notNullable().defaultTo(true)
      
      table.foreign('unidad_residencial_id').references('id').inTable('am_unidad_residencial').onDelete('CASCADE')
      table.foreign('plan_id').references('id').inTable('am_pricing_plans').onDelete('RESTRICT')
      
      table.index('unidad_residencial_id', 'idx_unidad_plan_unidad_id')
      table.index('plan_id', 'idx_unidad_plan_plan_id')
      table.index('es_actual', 'idx_unidad_plan_es_actual')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}