import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Company extends BaseModel {
  public static table = 'am_empresas'

  @column({ isPrimary: true })
  public id!: string

  @column()
  public logoUrl?: string

  @column({ columnName: 'tipo_documento_id' })
  public documentTypeId!: number

  @column({ columnName: 'documento' })
  public document!: string

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'direccion' })
  public address!: string

  @column({ columnName: 'telefono' })
  public phone!: string

  @column({ columnName: 'correo' })
  public email!: string

  @column({ columnName: 'tipo_compania_id' })
  public companyTypeId!: number

  @column({ columnName: 'estado' })
  public status!: string

  @column({ columnName: 'pais_id' })
  public countryId?: number

  @column({ columnName: 'departamento_id' })
  public stateId?: number

  @column({ columnName: 'ciudad_id' })
  public cityId?: number


  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
