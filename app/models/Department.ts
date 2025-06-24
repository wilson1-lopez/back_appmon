import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Country from './Country.js'
import City from './City.js'

export default class Department extends BaseModel {
  public static table = 'am_departamentos'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'dane_codigo' })
  public daneCode!: string

  @column({ columnName: 'nombre' })
  public name!: string

  @column({ columnName: 'pais_id' })
  public countryId!: number

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  @belongsTo(() => Country, {
    foreignKey: 'countryId',
  })
  public country!: BelongsTo<typeof Country>

  @hasMany(() => City, {
    foreignKey: 'departmentId',
  })
  public cities!: HasMany<typeof City>
}
