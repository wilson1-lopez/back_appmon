import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_registro_visitantes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.date('fecha_ingreso').notNullable()
      table.time('hora_ingreso').notNullable()
      table.time('hora_salida').nullable()
      table.text('foto_url').nullable()
      table.text('documento').notNullable()
      table.text('nombre_visitante').notNullable()
      table.uuid('torre_bloque_id').nullable()
      table.uuid('apartamento_id').nullable()
      table.uuid('visitante_id').nullable()
      table.text('estado').notNullable().defaultTo('ingreso')
      table.uuid('unidad_residencial_id').nullable()
      table.uuid('user_id').nullable()
      table.date('fecha_salida').nullable()
      table.integer('confirmacion_id').unsigned().notNullable()
      table.date('fecha_confirmacion').nullable()
      table.time('hora_confirmacion').nullable()
      table.text('usuario_quien_confirma').nullable()
      table.integer('tipo_documento_id').unsigned().nullable()
      table.boolean('es_domiciliario').notNullable().defaultTo(false)
      table.uuid('empresa_domicilio_id').nullable()
      
      table.foreign('torre_bloque_id').references('id').inTable('am_torre_bloque').onDelete('SET NULL')
      table.foreign('apartamento_id').references('id').inTable('am_apto').onDelete('SET NULL')
      table.foreign('visitante_id').references('id').inTable('am_visitantes').onDelete('SET NULL')
      table.foreign('unidad_residencial_id').references('id').inTable('am_unidad_residencial').onDelete('SET NULL')
      table.foreign('user_id').references('id').inTable('cf_usuarios').onDelete('SET NULL')
      table.foreign('confirmacion_id').references('id').inTable('am_confirmacion').onDelete('RESTRICT')
      table.foreign('tipo_documento_id').references('id').inTable('am_tipos_documento').onDelete('SET NULL')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
