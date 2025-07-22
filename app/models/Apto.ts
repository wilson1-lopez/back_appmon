import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TorreBloque from './TorreBloque.js'
import Agencia from './Agencia.js'
import VehiculoApto from './VehiculoApto.js'

export default class Apto extends BaseModel {
  public static table = 'am_apto'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'torre_bloque_id' })
  public torreBloqueId!: string

  @column({ columnName: 'numero_apto' })
  public numeroApto!: string

  @column({ columnName: 'nro_parqueadero' })
  public nroParqueadero?: string | null

  @column()
  public coeficiente?: number | null

  @column({ columnName: 'numero_cuarto_util' })
  public numeroCuartoUtil?: string | null

  @column({ columnName: 'area_libre' })
  public areaLibre?: string | null

  @column({ columnName: 'coeficiente_apto' })
  public coeApto?: number | null

  @column({ columnName: 'coeficiente_parqueadero' })
  public coeParqueadero?: number | null

  @column({ columnName: 'coeficiente_cuarto_util' })
  public coeCuartoUtil?: number | null

  @column({ columnName: 'coe_area_libre' })
  public coeAreaLibre?: number | null

  @column({ columnName: 'factura_digital' })
  public facturaDigital!: boolean

  @column({ columnName: 'estado_id' })
  public estadoId!: number

  @column()
  public alquilado!: boolean

  @column({ columnName: 'agencia_id' })
  public agenciaId?: string | null

  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ columnName: 'updated_at' })
  public updatedAt!: DateTime

  // Relaciones
  @belongsTo(() => TorreBloque, {
    foreignKey: 'torreBloqueId',
  })
  public torreBloque!: BelongsTo<typeof TorreBloque>

  @belongsTo(() => Agencia, {
    foreignKey: 'agenciaId',
  })
  public agencia!: BelongsTo<typeof Agencia>

  @hasMany(() => VehiculoApto, {
    foreignKey: 'apartamentoId',
  })
  public vehiculos!: HasMany<typeof VehiculoApto>
}
