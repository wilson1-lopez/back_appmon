import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BaseDocumentType extends BaseModel {
  public static table = 'am_tipos_documento_base'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'codigo' })
  public code!: string

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'estado' })
  public status!: boolean

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime
}
