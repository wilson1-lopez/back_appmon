import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tr_visitas'
  protected schemaName = 'template_schema'

  async up() {
    // Create template_schema if it doesn't exist
    this.schema.raw('CREATE SCHEMA IF NOT EXISTS template_schema')
    
    this.schema.withSchema(this.schemaName).createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('unidad_id').notNullable()
      table.text('visitante_nombre').notNullable()
      table.text('documento').nullable()
      table.text('placa').nullable()
      table.timestamp('fecha_ingreso').notNullable().defaultTo(this.now())
      table.timestamp('fecha_salida').nullable()
      table.text('observaciones').nullable()
      table.uuid('creado_por').nullable()
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.withSchema(this.schemaName).dropTable(this.tableName)
  }
}