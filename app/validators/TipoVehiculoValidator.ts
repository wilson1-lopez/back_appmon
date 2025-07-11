import vine from '@vinejs/vine'

export const createTipoVehiculoValidator = vine.compile(
  vine.object({
    codigo: vine.string().trim().minLength(1).maxLength(10),
    nombre: vine.string().trim().minLength(1).maxLength(100)
  })
)

export const updateTipoVehiculoValidator = vine.compile(
  vine.object({
    codigo: vine.string().trim().minLength(1).maxLength(10).optional(),
    nombre: vine.string().trim().minLength(1).maxLength(100).optional()
  })
)
