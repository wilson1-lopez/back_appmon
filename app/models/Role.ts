import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Permission from './Permission.js'
import BusinessType from './BusinessType.js'

export default class Role extends BaseModel {
  public static table = 'cf_roles'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'descripcion' })
  public description?: string | null

  @column({ columnName: 'estado' })
  public isActive!: boolean

  @column({ columnName: 'tipo_negocio_id' })
  public tipoNegocioId?: number | null

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  // Relación con permisos
  @hasMany(() => Permission, {
    foreignKey: 'roleId',
  })
  public permissions!: HasMany<typeof Permission>

  // Relación con BusinessType
  @belongsTo(() => BusinessType, {
    foreignKey: 'tipoNegocioId',
  })
  public businessType!: BelongsTo<typeof BusinessType>
}
