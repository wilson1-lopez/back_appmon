import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tr_autorizaciones'
  protected schemaName = 'template_schema'

  async up() {
    this.schema.withSchema(this.schemaName).createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('unidad_id').notNullable()
      table.uuid('residente_id').notNullable()
      table.text('visitante_nombre').notNullable()
      table.text('documento').nullable()
      table.timestamp('fecha_autorizacion').notNullable().defaultTo(this.now())
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