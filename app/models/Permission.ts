import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from './Role.js'
import Feature from './Feature.js'

export default class Permission extends BaseModel {
  public static table = 'cf_permisos'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'rol_id' })
  public roleId!: number

  @column({ columnName: 'funcionalidad_id' })
  public featureId!: number

  @column({ columnName: 'puede_ver' })
  public canView!: boolean

  @column({ columnName: 'puede_crear' })
  public canCreate!: boolean

  @column({ columnName: 'puede_editar' })
  public canEdit!: boolean

  @column({ columnName: 'puede_eliminar' })
  public canDelete!: boolean

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  // Relaciones
  @belongsTo(() => Role, {
    foreignKey: 'roleId',
  })
  public role!: BelongsTo<typeof Role>

  @belongsTo(() => Feature, {
    foreignKey: 'featureId',
  })
  public feature!: BelongsTo<typeof Feature>
}
