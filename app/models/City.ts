import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Department from './Department.js'

export default class City extends BaseModel {
  public static table = 'am_ciudades'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'dane_codigo' })
  public daneCode!: string

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'departamento_id' })
  public departmentId!: number

  @column({ columnName: 'estado' })
  public status!: boolean

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  @belongsTo(() => Department, {
    foreignKey: 'departmentId',
  })
  public department!: BelongsTo<typeof Department>
}
