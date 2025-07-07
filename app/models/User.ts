import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Role from './Role.js'

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

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  @column({ columnName: 'telefono' })
  public phone!: string

  // Relación many-to-many con roles
  @manyToMany(() => Role, {
    pivotTable: 'cf_usuario_rol',
    localKey: 'id',
    pivotForeignKey: 'usuario_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'rol_id',
  })
  public roles!: ManyToMany<typeof Role>
}
