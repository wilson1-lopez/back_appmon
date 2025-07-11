import { HttpContext } from '@adonisjs/core/http'
import AptoService from '#services/AptoService'
import { CreateAptoValidator, UpdateAptoValidator } from '#validators/AptoValidator'

export default class AptoController {
  private aptoService = new AptoService()

  /**
   * Obtener todos los apartamentos con paginación y filtros
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      
      const filters = {
        torreBloqueId: request.input('torreBloqueId'),
        estadoId: request.input('estadoId'),
        alquilado: request.input('alquilado'),
        numeroApto: request.input('numeroApto'),
      }

      const aptos = await this.aptoService.getAptos(page, limit, filters)
      
      return response.ok({
        message: 'Apartamentos obtenidos exitosamente',
        data: aptos,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Crear un nuevo apartamento
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = await request.validate({ schema: CreateAptoValidator })
      const apto = await this.aptoService.createApto(data)
      
      return response.created({
        message: 'Apartamento creado exitosamente',
        data: apto,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener un apartamento por ID
   */
  public async show({ params, response }: HttpContext) {
    try {
      const apto = await this.aptoService.getAptoById(params.id)
      
      return response.ok({
        message: 'Apartamento obtenido exitosamente',
        data: apto,
      })
    } catch (error) {
      return response.notFound({ error: error.message })
    }
  }

  /**
   * Actualizar un apartamento
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validate({ schema: UpdateAptoValidator })
      const apto = await this.aptoService.updateApto(params.id, data)
      
      return response.ok({
        message: 'Apartamento actualizado exitosamente',
        data: apto,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Eliminar un apartamento
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.aptoService.deleteApto(params.id)
      
      return response.ok(result)
    } catch (error) {
      return response.notFound({ error: error.message })
    }
  }

  /**
   * Obtener apartamentos por torre/bloque
   */
  public async byTorreBloque({ params, request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      
      const aptos = await this.aptoService.getAptosByTorreBloque(params.torreBloqueId, page, limit)
      
      return response.ok({
        message: 'Apartamentos de la torre/bloque obtenidos exitosamente',
        data: aptos,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener estadísticas de apartamentos
   */
  public async stats({ request, response }: HttpContext) {
    try {
      const torreBloqueId = request.input('torreBloqueId')
      const stats = await this.aptoService.getAptosStats(torreBloqueId)
      
      return response.ok({
        message: 'Estadísticas obtenidas exitosamente',
        data: stats,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Cambiar estado de alquiler de un apartamento
   */
  public async toggleAlquiler({ params, response }: HttpContext) {
    try {
      const apto = await this.aptoService.getAptoById(params.id)
      const updatedApto = await this.aptoService.updateApto(params.id, {
        alquilado: !apto.alquilado
      })
      
      return response.ok({
        message: `Apartamento ${updatedApto.alquilado ? 'marcado como alquilado' : 'marcado como disponible'}`,
        data: updatedApto,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Cambiar estado de facturación digital
   */
  public async toggleFacturaDigital({ params, response }: HttpContext) {
    try {
      const apto = await this.aptoService.getAptoById(params.id)
      const updatedApto = await this.aptoService.updateApto(params.id, {
        facturaDigital: !apto.facturaDigital
      })
      
      return response.ok({
        message: `Facturación digital ${updatedApto.facturaDigital ? 'activada' : 'desactivada'}`,
        data: updatedApto,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
