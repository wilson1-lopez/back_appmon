import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Feature extends BaseModel {
  public static table = 'cf_funcionalidades'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'descripcion' })
  public description?: string | null

  @column({ columnName: 'estado' })
  public isActive!: boolean

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime
}
