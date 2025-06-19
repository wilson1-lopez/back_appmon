import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_empresas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.text('logo_url').nullable()
      table.integer('tipo_documento_id').unsigned().notNullable()
      table.text('documento').notNullable()
      table.text('nombre').notNullable()
      table.text('direccion').notNullable()
      table.text('telefono').notNullable()
      table.text('correo').notNullable()
      table.integer('tipo_compania_id').unsigned().notNullable()
      table.text('estado').notNullable().defaultTo('activo')
      table.integer('pais_id').unsigned().nullable()
      table.integer('departamento_id').unsigned().nullable()
      table.integer('ciudad_id').unsigned().nullable()
      
      table.foreign('tipo_documento_id').references('id').inTable('am_tipos_documento').onDelete('RESTRICT')
      table.foreign('tipo_compania_id').references('id').inTable('am_tipos_compania').onDelete('RESTRICT')
      table.foreign('pais_id').references('id').inTable('am_paises').onDelete('RESTRICT')
      table.foreign('departamento_id').references('id').inTable('am_departamentos').onDelete('RESTRICT')
      table.foreign('ciudad_id').references('id').inTable('am_ciudades').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}