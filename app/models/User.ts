import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Role from './Role.js'
import UsuarioEmpresa from './UsuarioEmpresa.js'

export default class User extends BaseModel {
  public static table = 'cf_usuarios'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'nombre' })
  public firstName!: string

  @column({ columnName: 'apellido' })
  public lastName?: string | null

  @column({ columnName: 'correo' })
  public email!: string

  @column({ columnName: 'usuario' })
  public username!: string

  @column({ columnName: 'clave' })
  public password!: string

  @column({ columnName: 'estado' })
  public isActive!: boolean

  @column({ columnName: 'created_at' })
  public createdAt!: Date

  @column({ columnName: 'updated_at' })
  public updatedAt!: Date

  @column({ columnName: 'telefono' })
  public phone!: string

  // Relación hasMany con UsuarioEmpresa (empresas donde el usuario está vinculado)
  @hasMany(() => UsuarioEmpresa, { foreignKey: 'usuarioId' })
  public empresas!: HasMany<typeof UsuarioEmpresa>

  @manyToMany(() => Role, {
    pivotTable: 'cf_usuario_empresa_roles',
    pivotForeignKey: 'usuario_empresa_id',
    pivotRelatedForeignKey: 'rol_id',
    pivotColumns: ['activo'],
    onQuery: (query) => {
      query.where('cf_usuario_empresa_roles.activo', true)
    },
  })
  public roles!: ManyToMany<typeof Role>
}
