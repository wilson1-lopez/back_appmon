import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_perfiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('usuario_id').notNullable()
      table.uuid('empresa_id').nullable()
      table.uuid('unidad_residencial_id').nullable()
      
      table.foreign('usuario_id').references('id').inTable('cf_usuarios').onDelete('CASCADE')
      table.foreign('empresa_id').references('id').inTable('am_empresas').onDelete('CASCADE')
      table.foreign('unidad_residencial_id').references('id').inTable('am_unidad_residencial').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
