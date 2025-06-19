import { rules, schema } from "@adonisjs/validator";


export const RegisterCompanyValidator = schema.create({
  countryId: schema.number(),
  email: schema.string([rules.email(), rules.maxLength(255)]),
  password: schema.string([rules.minLength(8)]),
  documentTypeId: schema.number(),
  document: schema.string([rules.maxLength(30)]),
  name: schema.string([rules.maxLength(255)]), // nombre de la empresa
 // firstName: schema.string([rules.maxLength(50)]), // nombre del usuario
})