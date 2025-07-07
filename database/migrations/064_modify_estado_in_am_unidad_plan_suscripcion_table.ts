import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_unidad_plan_suscripcion'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Cambiar estado de text a FK
      table.integer('estado_id').unsigned().notNullable().defaultTo(1)
      table.foreign('estado_id').references('id').inTable('am_estados_suscripcion').onDelete('RESTRICT')
    })

    // Remover la columna text estado
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('estado')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['estado_id'])
      table.dropColumn('estado_id')
      table.text('estado').notNullable().defaultTo('activo')
    })
  }
}
