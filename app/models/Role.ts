import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Permission from './Permission.js'
import TipoRol from './TipoRol.js'

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

  @column({ columnName: 'tipo_rol_id' })
  public tipo_rol_id?: number | null

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  // Relación con permisos
  @hasMany(() => Permission, {
    foreignKey: 'roleId',
  })
  public permissions!: HasMany<typeof Permission>

  // Relación con TipoRol
  @belongsTo(() => TipoRol, {
    foreignKey: 'tipo_rol_id',
  })
  public tipoRol!: BelongsTo<typeof TipoRol>
}
