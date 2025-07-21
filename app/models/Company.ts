import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import DocumentType from './DocumentType.js'
import Country from './Country.js'
//import Department from './Department.js'
import City from './City.js'
import CompanyType from './CompanyType.js'

export default class Company extends BaseModel {
  public static table = 'am_empresas'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'logo_url' })
  public logoUrl?: string


  @column({ columnName: 'pais_id' })
  public countryId!: number

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

  @column({ columnName: 'ciudad_id' })
  public cityId!: number

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  // Relaciones
  @belongsTo(() => Country, {
    foreignKey: 'countryId',
  })
  public country!: BelongsTo<typeof Country>
  @belongsTo(() => DocumentType, {
    foreignKey: 'documentTypeId',
  })
  public documentType!: BelongsTo<typeof DocumentType>

  @belongsTo(() => City, {
    foreignKey: 'cityId',
  })
  public city!: BelongsTo<typeof City>

  @belongsTo(() => CompanyType, {
    foreignKey: 'companyTypeId',
  })
  public companyType!: BelongsTo<typeof CompanyType>

  // Relación hasMany con UsuarioEmpresa (usuarios vinculados a la empresa)
  // Ejemplo:
  // @hasMany(() => UsuarioEmpresa, { foreignKey: 'empresaId' })
  // public usuariosEmpresa!: HasMany<typeof UsuarioEmpresa>
}
