import vine from '@vinejs/vine'

/**
 * Validador para crear un vehículo de apartamento
 */
export const createVehiculoAptoValidator = vine.compile(
  vine.object({
    apartamento_id: vine.string().uuid(),
    tipo_id: vine.number().positive(),
    placa: vine.string().optional(),
    otro_tipo_descripcion: vine.string().optional(),
  })
)

/**
 * Validador para actualizar un vehículo de apartamento
 */
export const updateVehiculoAptoValidator = vine.compile(
  vine.object({
    apartamento_id: vine.string().uuid().optional(),
    tipo_id: vine.number().positive().optional(),
    placa: vine.string().optional(),
    otro_tipo_descripcion: vine.string().optional(),
  })
)
