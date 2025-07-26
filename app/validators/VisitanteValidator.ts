import { schema, rules } from '@adonisjs/validator'

export const VisitanteValidator = schema.create({
  tipo_documento_id: schema.number(),
  documento: schema.string([rules.maxLength(30)]),
  nombre: schema.string([rules.maxLength(100)]),
  apellido: schema.string.optional([rules.maxLength(100)]),
  telefono: schema.string.optional([rules.maxLength(30)]),
  correo: schema.string.optional([rules.email(), rules.maxLength(100)]),
  empresa_visitante: schema.string.optional([rules.maxLength(100)]),
  foto_url: schema.string.optional([rules.maxLength(255)]),
  unidad_residencial_id: schema.string.optional(),
})
