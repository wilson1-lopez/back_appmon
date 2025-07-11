import { HttpContext } from '@adonisjs/core/http'
import AgenciaService from '#services/AgenciaService'
import { CreateAgenciaValidator, UpdateAgenciaValidator } from '#validators/AgenciaValidator'

export default class AgenciaController {
  private agenciaService = new AgenciaService()

  /**
   * Obtener todas las agencias con paginación y filtros
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      
      const filters = {
        nombre: request.input('nombre'),
        ciudad: request.input('ciudad'),
        correo: request.input('correo'),
      }

      const agencias = await this.agenciaService.getAgencias(page, limit, filters)
      
      return response.ok({
        message: 'Agencias obtenidas exitosamente',
        data: agencias,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Crear una nueva agencia
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = await request.validate({ schema: CreateAgenciaValidator })
      const agencia = await this.agenciaService.createAgencia(data)
      
      return response.created({
        message: 'Agencia creada exitosamente',
        data: agencia,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener una agencia por ID
   */
  public async show({ params, response }: HttpContext) {
    try {
      const agencia = await this.agenciaService.getAgenciaById(params.id)
      
      return response.ok({
        message: 'Agencia obtenida exitosamente',
        data: agencia,
      })
    } catch (error) {
      return response.notFound({ error: error.message })
    }
  }

  /**
   * Actualizar una agencia
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validate({ schema: UpdateAgenciaValidator })
      const agencia = await this.agenciaService.updateAgencia(params.id, data)
      
      return response.ok({
        message: 'Agencia actualizada exitosamente',
        data: agencia,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Eliminar una agencia
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.agenciaService.deleteAgencia(params.id)
      
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener todas las agencias sin paginación (para selects)
   */
  public async all({ response }: HttpContext) {
    try {
      const agencias = await this.agenciaService.getAllAgencias()
      
      return response.ok({
        message: 'Listado de agencias obtenido exitosamente',
        data: agencias,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Buscar agencias por texto
   */
  public async search({ request, response }: HttpContext) {
    try {
      const searchTerm = request.input('q', '')
      const limit = request.input('limit', 10)
      
      if (!searchTerm) {
        return response.badRequest({ error: 'El parámetro de búsqueda "q" es requerido' })
      }
      
      const agencias = await this.agenciaService.searchAgencias(searchTerm, limit)
      
      return response.ok({
        message: 'Búsqueda realizada exitosamente',
        data: agencias,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener estadísticas de agencias
   */
  public async stats({ response }: HttpContext) {
    try {
      const stats = await this.agenciaService.getAgenciasStats()
      
      return response.ok({
        message: 'Estadísticas obtenidas exitosamente',
        data: stats,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener apartamentos de una agencia
   */
  public async apartamentos({ params, request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      
      const apartamentos = await this.agenciaService.getApartamentosByAgencia(
        params.id, 
        page, 
        limit
      )
      
      return response.ok({
        message: 'Apartamentos de la agencia obtenidos exitosamente',
        data: apartamentos,
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
