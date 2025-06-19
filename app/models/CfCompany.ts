import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CfCompany extends BaseModel {
  public static table = 'cf_empresas'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'empresa_id' })
  public companyId!: string

  @column({ columnName: 'esquema' })
  public schema!: string

  @column.dateTime({ columnName: 'fecha_creacion' })
  public createdOn!: DateTime

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
