import type { HttpContext } from '@adonisjs/core/http'
import VehiculoAptoService from '#services/VehiculoAptoService'
import { createVehiculoAptoValidator, updateVehiculoAptoValidator } from '#validators/VehiculoAptoValidator'

export default class VehiculoAptoController {
  private vehiculoAptoService: VehiculoAptoService

  constructor() {
    this.vehiculoAptoService = new VehiculoAptoService()
  }

  /**
   * Obtiene todos los vehículos de apartamentos
   */
  async index({ response }: HttpContext) {
    try {
      const vehiculos = await this.vehiculoAptoService.getAllVehiculos()
      return response.ok({
        success: true,
        data: vehiculos,
        message: 'Vehículos obtenidos exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los vehículos',
        error: error.message
      })
    }
  }

  /**
   * Obtiene un vehículo por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const vehiculo = await this.vehiculoAptoService.getVehiculoById(params.id)
      return response.ok({
        success: true,
        data: vehiculo,
        message: 'Vehículo obtenido exitosamente'
      })
    } catch (error) {
      return response.notFound({
        success: false,
        message: 'Vehículo no encontrado',
        error: error.message
      })
    }
  }

  /**
   * Obtiene los vehículos de un apartamento específico
   */
  async byApartamento({ params, response }: HttpContext) {
    try {
      const vehiculos = await this.vehiculoAptoService.getVehiculosByApartamento(params.apartamentoId)
      return response.ok({
        success: true,
        data: vehiculos,
        message: 'Vehículos del apartamento obtenidos exitosamente'
      })
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({
          success: false,
          message: error.message
        })
      }
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los vehículos del apartamento',
        error: error.message
      })
    }
  }

  /**
   * Crea un nuevo vehículo para un apartamento
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createVehiculoAptoValidator)
      const vehiculo = await this.vehiculoAptoService.createVehiculo(payload)
      
      return response.created({
        success: true,
        data: vehiculo,
        message: 'Vehículo registrado exitosamente'
      })
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({
          success: false,
          message: error.message
        })
      }
      if (error.status === 409) {
        return response.conflict({
          success: false,
          message: error.message
        })
      }
      if (error.status === 422) {
        return response.unprocessableEntity({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: error.messages
        })
      }
      return response.internalServerError({
        success: false,
        message: 'Error al registrar el vehículo',
        error: error.message
      })
    }
  }

  /**
   * Actualiza un vehículo existente
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateVehiculoAptoValidator)
      const vehiculo = await this.vehiculoAptoService.updateVehiculo(params.id, payload)
      
      return response.ok({
        success: true,
        data: vehiculo,
        message: 'Vehículo actualizado exitosamente'
      })
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({
          success: false,
          message: error.message
        })
      }
      if (error.status === 409) {
        return response.conflict({
          success: false,
          message: error.message
        })
      }
      if (error.status === 422) {
        return response.unprocessableEntity({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: error.messages
        })
      }
      return response.internalServerError({
        success: false,
        message: 'Error al actualizar el vehículo',
        error: error.message
      })
    }
  }

  /**
   * Elimina un vehículo
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.vehiculoAptoService.deleteVehiculo(params.id)
      return response.ok({
        success: true,
        message: 'Vehículo eliminado exitosamente'
      })
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({
          success: false,
          message: error.message
        })
      }
      return response.internalServerError({
        success: false,
        message: 'Error al eliminar el vehículo',
        error: error.message
      })
    }
  }

  /**
   * Obtiene estadísticas de vehículos
   */
  async estadisticas({ response }: HttpContext) {
    try {
      const stats = await this.vehiculoAptoService.getEstadisticas()
      return response.ok({
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener las estadísticas',
        error: error.message
      })
    }
  }
}
