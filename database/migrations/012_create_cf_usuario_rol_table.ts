import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_usuario_rol'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('usuario_id').notNullable()
      table.integer('rol_id').unsigned().notNullable()
      table.timestamp('asignado_en').notNullable().defaultTo(this.now())
      
      table.foreign('usuario_id').references('id').inTable('cf_usuarios').onDelete('CASCADE')
      table.foreign('rol_id').references('id').inTable('cf_roles').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}