import vine from '@vinejs/vine'

export const createPropietarioValidator = vine.compile(
  vine.object({
    nombre: vine.string().trim().minLength(2).maxLength(100),
    apellido: vine.string().trim().minLength(2).maxLength(100),
    tipoDocumentoId: vine.number().positive(),
    documento: vine.string().trim().optional().nullable(),
    telefono: vine.string().trim().optional().nullable(),
    correo: vine.string().trim().email().optional().nullable(),
    fotoUrl: vine.string().trim().optional().nullable(),
    esResidente: vine.boolean().optional(), // Se guarda en la tabla pivote
    apartamentoId: vine.string().uuid(),
    generoId: vine.number().positive().optional().nullable(),
    unidadResidencialId: vine.string().uuid().optional().nullable(),
  })
)

export const updatePropietarioValidator = vine.compile(
  vine.object({
    nombre: vine.string().trim().minLength(2).maxLength(100).optional(),
    apellido: vine.string().trim().minLength(2).maxLength(100).optional(),
    tipoDocumentoId: vine.number().positive().optional(),
    documento: vine.string().trim().optional().nullable(),
    telefono: vine.string().trim().optional().nullable(),
    correo: vine.string().trim().email().optional().nullable(),
    fotoUrl: vine.string().trim().optional().nullable(),
    generoId: vine.number().positive().optional().nullable(),
    unidadResidencialId: vine.string().uuid().optional().nullable(),
  })
)
