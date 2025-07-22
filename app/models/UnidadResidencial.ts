import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import DocumentType from './DocumentType.js'
import Company from './Company.js'
import City from './City.js'

export default class UnidadResidencial extends BaseModel {
  @column()
  public estado!: boolean
  public static table = 'am_unidad_residencial'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'logo_url' })
  public logoUrl?: string

  @column({ columnName: 'tipo_documento_id' })
  public documentTypeId!: number

  @column({ columnName: 'documento' })
  public document!: string

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'direccion' })
  public address!: string

  @column({ columnName: 'ciudad_id' })
  public ciudadId!: number

  @column({ columnName: 'telefono_administradora' })
  public adminPhone!: string

  @column({ columnName: 'telefono_soporte' })
  public supportPhone!: string

  @column({ columnName: 'correo_contacto' })
  public contactEmail!: string

  @column({ columnName: 'descripcion' })
  public description?: string

  @column({ columnName: 'empresa_id' })
  public companyId?: string

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  // Relaciones
  @belongsTo(() => DocumentType, {
    foreignKey: 'documentTypeId',
  })
  public documentType!: BelongsTo<typeof DocumentType>

  @belongsTo(() => Company, {
    foreignKey: 'companyId',
  })
  public company!: BelongsTo<typeof Company>

  @belongsTo(() => City, {
    foreignKey: 'ciudadId',
  })
  public city!: BelongsTo<typeof City>
}
