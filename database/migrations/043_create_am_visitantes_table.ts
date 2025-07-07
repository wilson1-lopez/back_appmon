import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_visitantes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.text('documento').notNullable()
      table.text('nombre').notNullable()
      table.text('observaciones').nullable()
      table.uuid('unidad_residencial_id').nullable()
      table.uuid('user_id').nullable()
      table.integer('tipo_documento_id').unsigned().nullable()
      table.text('foto_url').nullable()
      
      table.foreign('unidad_residencial_id').references('id').inTable('am_unidad_residencial').onDelete('SET NULL')
      table.foreign('user_id').references('id').inTable('cf_usuarios').onDelete('SET NULL')
      table.foreign('tipo_documento_id').references('id').inTable('am_tipos_documento').onDelete('SET NULL')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
