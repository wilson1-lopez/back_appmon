import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from './Role.js'

export default class UsuarioEmpresaRol extends BaseModel {
  @belongsTo(() => Role, { foreignKey: 'rolId' })
  public role!: BelongsTo<typeof Role>
  public static table = 'cf_usuario_empresa_roles'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'usuario_empresa_id' })
  public usuarioEmpresaId!: string

  @column({ columnName: 'rol_id' })
  public rolId!: number

  @column({ columnName: 'asignado_por' })
  public asignadoPor!: string

  @column({ columnName: 'activo' })
  public activo!: boolean
}
