import type { HttpContext } from '@adonisjs/core/http'
import TipoVehiculoService from '#services/TipoVehiculoService'
import { createTipoVehiculoValidator, updateTipoVehiculoValidator } from '#validators/TipoVehiculoValidator'

export default class TipoVehiculoController {
  private tipoVehiculoService: TipoVehiculoService

  constructor() {
    this.tipoVehiculoService = new TipoVehiculoService()
  }

  /**
   * Obtiene todos los tipos de vehículos
   */
  async index({ response }: HttpContext) {
    try {
      const tiposVehiculo = await this.tipoVehiculoService.getAllTiposVehiculo()
      return response.ok({
        success: true,
        data: tiposVehiculo,
        message: 'Tipos de vehículos obtenidos exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los tipos de vehículos',
        error: error.message
      })
    }
  }

  /**
   * Obtiene un tipo de vehículo por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const tipoVehiculo = await this.tipoVehiculoService.getTipoVehiculoById(params.id)
      return response.ok({
        success: true,
        data: tipoVehiculo,
        message: 'Tipo de vehículo obtenido exitosamente'
      })
    } catch (error) {
      return response.notFound({
        success: false,
        message: 'Tipo de vehículo no encontrado',
        error: error.message
      })
    }
  }

  /**
   * Crea un nuevo tipo de vehículo
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createTipoVehiculoValidator)
      const tipoVehiculo = await this.tipoVehiculoService.createTipoVehiculo(data)
      return response.created({
        success: true,
        data: tipoVehiculo,
        message: 'Tipo de vehículo creado exitosamente'
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Error al crear el tipo de vehículo',
        error: error.message
      })
    }
  }

  /**
   * Actualiza un tipo de vehículo
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateTipoVehiculoValidator)
      const tipoVehiculo = await this.tipoVehiculoService.updateTipoVehiculo(params.id, data)
      return response.ok({
        success: true,
        data: tipoVehiculo,
        message: 'Tipo de vehículo actualizado exitosamente'
      })
    } catch (error) {
      return response.notFound({
        success: false,
        message: 'Tipo de vehículo no encontrado',
        error: error.message
      })
    }
  }

  /**
   * Elimina un tipo de vehículo
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.tipoVehiculoService.deleteTipoVehiculo(params.id)
      return response.ok({
        success: true,
        data: result,
        message: 'Tipo de vehículo eliminado exitosamente'
      })
    } catch (error) {
      return response.notFound({
        success: false,
        message: 'Tipo de vehículo no encontrado',
        error: error.message
      })
    }
  }
}
