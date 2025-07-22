import { rules, schema } from "@adonisjs/validator"

export const CreateUnidadResidencialValidator = schema.create({
  documentTypeId: schema.number(),
  document: schema.string([rules.maxLength(50)]),
  name: schema.string([rules.maxLength(255)]),
  address: schema.string([rules.maxLength(500)]),
  city: schema.number(),
  adminPhone: schema.string([rules.maxLength(20)]),
  supportPhone: schema.string([rules.maxLength(20)]),
  contactEmail: schema.string([rules.email(), rules.maxLength(255)]),
  description: schema.string.optional([rules.maxLength(1000)])
})

export const UpdateUnidadResidencialValidator = schema.create({
  documentTypeId: schema.number.optional(),
  document: schema.string.optional([rules.maxLength(50)]),
  name: schema.string.optional([rules.maxLength(255)]),
  address: schema.string.optional([rules.maxLength(500)]),
  city: schema.string.optional([rules.maxLength(100)]),
  adminPhone: schema.string.optional([rules.maxLength(20)]),
  supportPhone: schema.string.optional([rules.maxLength(20)]),
  contactEmail: schema.string.optional([rules.email(), rules.maxLength(255)]),
  description: schema.string.optional([rules.maxLength(1000)])
})
