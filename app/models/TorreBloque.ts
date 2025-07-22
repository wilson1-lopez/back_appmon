import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import UnidadResidencial from './UnidadResidencial.js'
import Apto from './Apto.js'

export default class TorreBloque extends BaseModel {
  @column()
  public estado!: boolean
  public static table = 'am_torre_bloque'

  @column({ isPrimary: true })
  public id!: string

  @column()
  public nombre!: string

  @column()
  public pisos!: number

  @column()
  public descripcion?: string

  @column()
  public unidadId!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => UnidadResidencial, {
    foreignKey: 'unidadId',
  })
  public unidadResidencial!: BelongsTo<typeof UnidadResidencial>

  @hasMany(() => Apto, {
    foreignKey: 'torreBloqueId',
  })
  public apartamentos!: HasMany<typeof Apto>
}
