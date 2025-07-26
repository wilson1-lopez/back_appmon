import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Visitante extends BaseModel {
  public static table = 'am_visitantes'

  @column({ isPrimary: true })
  public id: string

  @column()
  public nombre: string

  @column()
  public documento: string

  @column()
  public tipo_documento_id: number

  @column()
  public unidad_residencial_id: string


  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
  
  @column()
  public apellido?: string
  
  @column()
  public telefono?: string
  
  @column()
  public correo?: string
  
  @column()
  public empresa_visitante?: string
  
  @column()
  public foto_url?: string
}
