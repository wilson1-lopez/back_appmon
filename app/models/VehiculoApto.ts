import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Apto from './Apto.js'
import TipoVehiculo from './TipoVehiculo.js'

export default class VehiculoApto extends BaseModel {
  public static table = 'am_vehiculos_x_apto'

  @column({ isPrimary: true })
  public id!: string

  @column({ columnName: 'apartamento_id' })
  public apartamentoId!: string

  @column({ columnName: 'tipo_id' })
  public tipoId!: number

  @column()
  public placa?: string | null

  @column({ columnName: 'otro_tipo_descripcion' })
  public otroTipoDescripcion?: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  // Relaciones
  @belongsTo(() => Apto, {
    foreignKey: 'apartamentoId',
  })
  public apartamento!: BelongsTo<typeof Apto>

  @belongsTo(() => TipoVehiculo, {
    foreignKey: 'tipoId',
  })
  public tipoVehiculo!: BelongsTo<typeof TipoVehiculo>
}
