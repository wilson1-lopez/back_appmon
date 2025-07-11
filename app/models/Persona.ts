import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import UnidadResidencial from './UnidadResidencial.js'
import Apto from './Apto.js'

export default class Persona extends BaseModel {
  public static table = 'am_personas'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'tipo_documento_id' })
  public tipoDocumentoId!: number

  @column()
  public documento?: string | null

  @column()
  public nombre!: string

  @column()
  public apellido!: string

  @column({ columnName: 'genero_id' })
  public generoId?: number | null

  @column()
  public correo?: string | null

  @column()
  public telefono?: string | null

  @column({ columnName: 'foto_url' })
  public fotoUrl?: string | null

  @column({ columnName: 'unidad_residencial_id' })
  public unidadResidencialId?: string | null

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  // Relaciones
  @belongsTo(() => UnidadResidencial, {
    foreignKey: 'unidadResidencialId',
  })
  public unidadResidencial!: BelongsTo<typeof UnidadResidencial>

  @manyToMany(() => Apto, {
    pivotTable: 'am_propietarios_x_apto',
    localKey: 'id',
    pivotForeignKey: 'propietario_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'apartamento_id',
    pivotColumns: ['es_residente'], // Incluir el campo es_residente de la tabla pivote
  })
  public apartamentos!: ManyToMany<typeof Apto>
}
