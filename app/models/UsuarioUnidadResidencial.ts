import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UsuarioUnidadRol from './UsuarioUnidadRol.js'

export default class UsuarioUnidadResidencial extends BaseModel {
  public static table = 'cf_usuario_unidad_residencial'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'usuario_id' })
  public usuarioId!: string

  @column({ columnName: 'unidad_residencial_id' })
  public unidadResidencialId!: string

  @hasMany(() => UsuarioUnidadRol, {
    foreignKey: 'usuarioUnidadId',
  })
  public roles!: HasMany<typeof UsuarioUnidadRol>
}
