import { schema, rules } from '@adonisjs/validator'

export const CreateUserValidator = schema.create({
  firstName: schema.string({}, [rules.required()]),
  lastName: schema.string.optional(),
  email: schema.string({}, [
    rules.required(),
    rules.email(),
    // La unicidad debe validarse manualmente en el controlador o servicio
  ]),
  username: schema.string({}, [rules.required()]),
  password: schema.string({}, [
    rules.required(),
    rules.minLength(8),
    rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
  ]),
  phone: schema.string({}, [
    rules.required(),
    rules.mobile({ strict: true }),
  ]),
  companyId: schema.number([rules.required()]),
  rolId: schema.number([rules.required()]),
  unidadResidencialId: schema.number([rules.required()]),
})
