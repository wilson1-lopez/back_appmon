import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TipoRol extends BaseModel {
  public static table = 'cf_tipo_rol'

  @column({ isPrimary: true })
  public id!: number

  @column()
  public nombre!: string
}
