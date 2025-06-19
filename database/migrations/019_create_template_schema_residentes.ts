import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tr_residentes'
  protected schemaName = 'template_schema'

  async up() {
    this.schema.withSchema(this.schemaName).createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('unidad_id').notNullable()
      table.text('nombre').notNullable()
      table.text('documento').notNullable()
      table.text('tipo_documento').notNullable()
      table.text('correo').nullable()
      table.text('telefono').nullable()
      table.boolean('estado').defaultTo(true)
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.withSchema(this.schemaName).dropTable(this.tableName)
  }
}