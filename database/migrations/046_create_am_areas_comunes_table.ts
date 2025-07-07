import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_areas_comunes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('id_unidad_residencial').notNullable()
      table.uuid('id_tipo_area').notNullable()
      table.text('nombre_area').notNullable()
      table.text('descripcion').nullable()
      table.text('estado').notNullable().defaultTo('borrador')
      table.decimal('costo', 10, 2).notNullable().defaultTo(0)
      table.uuid('id_unidad_cobro').nullable()
      table.integer('duracion_min_reserva_valor').nullable()
      table.text('duracion_min_reserva_unidad').nullable()
      table.integer('duracion_max_reserva_valor').nullable()
      table.text('duracion_max_reserva_unidad').nullable()
      table.integer('capacidad_maxima').nullable()
      table.integer('antelacion_reserva_valor').nullable()
      table.text('antelacion_reserva_unidad').nullable()
      table.text('politicas_uso').nullable()
      table.boolean('requiere_aprobacion').defaultTo(false)
      table.specificType('emails_notificacion', 'text[]').nullable()
      table.uuid('user_created').nullable()
      table.uuid('user_updated').nullable()
      
      table.foreign('id_unidad_residencial').references('id').inTable('am_unidad_residencial').onDelete('RESTRICT')
      table.foreign('id_tipo_area').references('id').inTable('am_tipos_area_comun').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
