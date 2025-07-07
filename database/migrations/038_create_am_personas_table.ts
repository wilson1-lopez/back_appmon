import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_personas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.integer('tipo_documento_id').unsigned().notNullable()
      table.text('documento').nullable()
      table.text('nombre').notNullable()
      table.text('apellido').notNullable()
      table.integer('genero_id').unsigned().nullable()
      table.text('correo').nullable().unique()
      table.text('telefono').nullable()
      table.uuid('unidad_residencial_id').nullable()
      
      table.foreign('tipo_documento_id').references('id').inTable('am_tipos_documento').onDelete('RESTRICT')
      table.foreign('genero_id').references('id').inTable('am_generos').onDelete('SET NULL')
      table.foreign('unidad_residencial_id').references('id').inTable('am_unidad_residencial').onDelete('SET NULL')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
