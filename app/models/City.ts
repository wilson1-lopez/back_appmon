import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class City extends BaseModel {
  public static table = 'am_ciudades'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'dane_codigo' })
  public daneCode!: string

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'departamento_id' })
  public departmentId!: number

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime
}
