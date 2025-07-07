import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_consejo_administracion'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('unidad_residencial_id').notNullable()
      table.integer('year').notNullable()
      table.uuid('persona_id').notNullable()
      table.uuid('apto_id').notNullable()
      table.integer('rol_id').unsigned().notNullable()
      
      table.foreign('unidad_residencial_id').references('id').inTable('am_unidad_residencial').onDelete('RESTRICT')
      table.foreign('persona_id').references('id').inTable('am_personas').onDelete('RESTRICT')
      table.foreign('apto_id').references('id').inTable('am_apto').onDelete('RESTRICT')
      table.foreign('rol_id').references('id').inTable('am_rol_consejo').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
