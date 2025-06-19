import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'am_unidad_residencial'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.text('logo_url').nullable()
      table.integer('tipo_documento_id').unsigned().notNullable()
      table.text('documento').notNullable()
      table.text('nombre').notNullable()
      table.text('direccion').notNullable()
      table.text('ciudad').notNullable()
      table.text('telefono_administradora').notNullable()
      table.text('telefono_soporte').notNullable()
      table.text('correo_contacto').notNullable()
      table.text('descripcion').nullable()
      table.uuid('empresa_id').nullable()
      
      table.foreign('empresa_id').references('id').inTable('am_empresas').onDelete('RESTRICT')
      table.foreign('tipo_documento_id').references('id').inTable('am_tipos_documento').onDelete('RESTRICT')
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}