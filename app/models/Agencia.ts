import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Apto from './Apto.js'

export default class Agencia extends BaseModel {
  public static table = 'am_agencias'

  @column({ isPrimary: true })
  public id!: string

  @column()
  public nombre!: string

  @column({ columnName: 'contacto_nombre' })
  public contactoNombre?: string | null

  @column()
  public correo?: string | null

  @column()
  public telefono?: string | null

  @column()
  public direccion?: string | null

  @column()
  public ciudad?: string | null

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  // Relaciones
  @hasMany(() => Apto, {
    foreignKey: 'agenciaId',
  })
  public apartamentos!: HasMany<typeof Apto>
}
