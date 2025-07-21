import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UsuarioEmpresaRol from './UsuarioEmpresaRol.js'


export default class UsuarioEmpresa extends BaseModel {
  public static table = 'cf_usuario_empresa'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'usuario_id' })
  public usuarioId!: string

  @column({ columnName: 'empresa_id' })
  public empresaId!: string

  @hasMany(() => UsuarioEmpresaRol, {
    foreignKey: 'usuarioEmpresaId',
  })
  public roles!: HasMany<typeof UsuarioEmpresaRol>
}
