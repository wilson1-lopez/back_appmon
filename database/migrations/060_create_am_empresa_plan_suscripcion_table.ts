import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_empresa_plan_suscripcion'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('empresa_id').notNullable()
      table.uuid('plan_id').notNullable()
      table.timestamp('fecha_inicio').notNullable().defaultTo(this.now())
      table.timestamp('fecha_fin').nullable()
      table.boolean('es_actual').notNullable().defaultTo(true)
      table.integer('estado_id').unsigned().notNullable()
      
      table.foreign('empresa_id').references('id').inTable('am_empresas').onDelete('CASCADE')
      table.foreign('plan_id').references('id').inTable('am_pricing_plans').onDelete('RESTRICT')
      table.foreign('estado_id').references('id').inTable('am_estados_suscripcion').onDelete('RESTRICT')
      
      // Índice único para asegurar solo un plan activo por empresa
      table.index(['empresa_id'], 'idx_empresa_plan_empresa_id')
      table.index(['es_actual'], 'idx_empresa_plan_es_actual')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })

    // Crear índice único condicional para es_actual
    this.schema.raw(`
      CREATE UNIQUE INDEX uq_empresa_plan_activo 
      ON ${this.tableName} (empresa_id) 
      WHERE es_actual = true
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
