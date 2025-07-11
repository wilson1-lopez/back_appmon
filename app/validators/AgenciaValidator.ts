import { schema, rules } from '@adonisjs/validator'

export const CreateAgenciaValidator = schema.create({
  nombre: schema.string({}, [
    rules.required(),
    rules.maxLength(255),
  ]),
  contactoNombre: schema.string.optional({}, [
    rules.maxLength(255),
  ]),
  correo: schema.string.optional({}, [
    rules.email(),
    rules.maxLength(255),
  ]),
  telefono: schema.string.optional({}, [
    rules.maxLength(50),
  ]),
  direccion: schema.string.optional({}, [
    rules.maxLength(500),
  ]),
  ciudad: schema.string.optional({}, [
    rules.maxLength(255),
  ]),
})

export const UpdateAgenciaValidator = schema.create({
  nombre: schema.string.optional({}, [
    rules.maxLength(255),
  ]),
  contactoNombre: schema.string.optional({}, [
    rules.maxLength(255),
  ]),
  correo: schema.string.optional({}, [
    rules.email(),
    rules.maxLength(255),
  ]),
  telefono: schema.string.optional({}, [
    rules.maxLength(50),
  ]),
  direccion: schema.string.optional({}, [
    rules.maxLength(500),
  ]),
  ciudad: schema.string.optional({}, [
    rules.maxLength(255),
  ]),
})
