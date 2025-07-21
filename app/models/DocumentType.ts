import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import BaseDocumentType from './BaseDocumentType.js'
import Country from './Country.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DocumentType extends BaseModel {
  public static table = 'am_tipos_documento'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'tipo_documento_base_id' })
  public baseTypeId!: number

  @column({ columnName: 'pais_id' })
  public countryId!: number

  @column({ columnName: 'estado' })
  public status!: boolean

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  @belongsTo(() => BaseDocumentType, {
    foreignKey: 'baseTypeId',
  })
  public baseType!: BelongsTo<typeof BaseDocumentType>

  @belongsTo(() => Country, {
    foreignKey: 'countryId',
  })
  public country!: BelongsTo<typeof Country>
}
  
