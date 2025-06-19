import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_empresas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('empresa_id').notNullable()
      table.text('esquema').notNullable().unique()
      table.timestamp('fecha_creacion').notNullable().defaultTo(this.now())
      
      table.foreign('empresa_id').references('id').inTable('am_empresas').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}