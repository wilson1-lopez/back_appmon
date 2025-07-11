import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TipoVehiculo extends BaseModel {
  public static table = 'am_tipos_vehiculo'

  @column({ isPrimary: true })
  public id!: number

  @column()
  public codigo!: string

  @column()
  public nombre!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
