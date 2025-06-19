import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Country extends BaseModel {
  public static table = 'am_paises'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'codigo_internacional' })
  public internationalCode!: string

  @column({ columnName: 'icono_pais' })
  public countryIcon!: string | null

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime
}
