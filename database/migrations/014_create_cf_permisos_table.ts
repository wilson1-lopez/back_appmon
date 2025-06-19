import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cf_permisos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('rol_id').unsigned().notNullable()
      table.integer('funcionalidad_id').unsigned().notNullable()
      table.boolean('puede_ver').defaultTo(false)
      table.boolean('puede_crear').defaultTo(false)
      table.boolean('puede_editar').defaultTo(false)
      table.boolean('puede_eliminar').defaultTo(false)
      
      table.unique(['rol_id', 'funcionalidad_id'], 'uq_permiso')
      table.foreign('rol_id').references('id').inTable('cf_roles').onDelete('CASCADE')
      table.foreign('funcionalidad_id').references('id').inTable('cf_funcionalidades').onDelete('CASCADE')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}