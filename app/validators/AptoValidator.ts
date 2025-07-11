import { schema, rules } from '@adonisjs/validator'

export const CreateAptoValidator = schema.create({
  torreBloqueId: schema.string({}, [
    rules.required(),
    rules.uuid(),
  ]),
  numeroApto: schema.string({}, [
    rules.required(),
    rules.maxLength(20),
  ]),
  nroParqueadero: schema.string.optional({}, [
    rules.maxLength(20),
  ]),
  coeficiente: schema.number.optional(),
  numeroCuartoUtil: schema.string.optional({}, [
    rules.maxLength(20),
  ]),
  areaLibre: schema.string.optional({}, [
    rules.maxLength(20),
  ]),
  coeApto: schema.number.optional(),
  coeParqueadero: schema.number.optional(),
  coeCuartoUtil: schema.number.optional(),
  coeAreaLibre: schema.number.optional(),
  facturaDigital: schema.boolean.optional(),
  estadoId: schema.number([
    rules.required(),
    rules.unsigned(),
  ]),
  alquilado: schema.boolean.optional(),
  agenciaId: schema.string.optional({}, [
    rules.uuid(),
  ]),
})

export const UpdateAptoValidator = schema.create({
  torreBloqueId: schema.string.optional({}, [
    rules.uuid(),
  ]),
  numeroApto: schema.string.optional({}, [
    rules.maxLength(20),
  ]),
  nroParqueadero: schema.string.optional({}, [
    rules.maxLength(20),
  ]),
  coeficiente: schema.number.optional(),
  numeroCuartoUtil: schema.string.optional({}, [
    rules.maxLength(20),
  ]),
  areaLibre: schema.string.optional({}, [
    rules.maxLength(20),
  ]),
  coeApto: schema.number.optional(),
  coeParqueadero: schema.number.optional(),
  coeCuartoUtil: schema.number.optional(),
  coeAreaLibre: schema.number.optional(),
  facturaDigital: schema.boolean.optional(),
  estadoId: schema.number.optional([
    rules.unsigned(),
  ]),
  alquilado: schema.boolean.optional(),
  agenciaId: schema.string.optional({}, [
    rules.uuid(),
  ]),
})
