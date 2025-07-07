import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_logs_auditoria'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id_log').primary()
      table.string('id').notNullable()
      table.string('accion').notNullable()
      table.jsonb('datos').nullable()
      table.string('resultado').nullable()
      table.timestamp('log_timestamp').defaultTo(this.now())
      table.specificType('ip_origen', 'inet').nullable()
      table.text('user_agent').nullable()
      table.string('telefono_destino').nullable()
      table.integer('duracion_ms').nullable()
      table.text('error_message').nullable()
      table.jsonb('webhook_response').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
