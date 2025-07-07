import { HttpContext } from '@adonisjs/core/http'
import UnidadResidencialService from '#services/UnidadResidencialService'
import { CreateUnidadResidencialValidator, UpdateUnidadResidencialValidator } from '#validators/UnidadResidencialValidator'

export default class UnidadResidencialController {
  private unidadResidencialService = new UnidadResidencialService()

  /**
   * Crear una nueva unidad residencial
   */
  public async store({ request, response, auth }: HttpContext) {
    try {
      if (!auth?.user?.email) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const data = await request.validate({ schema: CreateUnidadResidencialValidator })
      
      const unidadResidencial = await this.unidadResidencialService.create(auth.user.email, data)
      
      return response.created({ 
        message: 'Unidad residencial creada exitosamente',
        data: unidadResidencial 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener una unidad residencial por ID
   */
  public async show({ params, response, auth }: HttpContext) {
    try {
      if (!auth?.user?.email) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const unidadResidencial = await this.unidadResidencialService.getById(params.id, auth.user.email)
      
      if (!unidadResidencial) {
        return response.notFound({ error: 'Unidad residencial no encontrada' })
      }

      return response.ok({ 
        message: 'Unidad residencial obtenida exitosamente',
        data: unidadResidencial 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Listar unidades residenciales de la empresa del usuario
   */
  public async index({ request, response, auth }: HttpContext) {
    try {
      if (!auth?.user?.email) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const search = request.input('search', '')
      
      const unidadesResidenciales = await this.unidadResidencialService.getByCompany(auth.user.email, { 
        page, 
        limit, 
        search 
      })
      
      return response.ok({ 
        message: 'Lista de unidades residenciales obtenida exitosamente',
        data: unidadesResidenciales 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Listar todas las unidades residenciales de la empresa del usuario (sin paginación)
   */
  public async all({ request, response, auth }: HttpContext) {
    try {
      if (!auth?.user?.email) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const search = request.input('search', '')
      const unidadesResidenciales = await this.unidadResidencialService.getAllByCompany(auth.user.email, { search })

      return response.ok({
        message: 'Lista completa de unidades residenciales obtenida exitosamente',
        data: unidadesResidenciales
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Actualizar una unidad residencial
   */
  public async update({ params, request, response, auth }: HttpContext) {
    try {
      if (!auth?.user?.email) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const updateData = await request.validate({ schema: UpdateUnidadResidencialValidator })
      
      const unidadResidencial = await this.unidadResidencialService.update(
        params.id, 
        auth.user.email, 
        updateData
      )
      
      return response.ok({ 
        message: 'Unidad residencial actualizada exitosamente',
        data: unidadResidencial 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Eliminar una unidad residencial
   */
  public async destroy({ params, response, auth }: HttpContext) {
    try {
      if (!auth?.user?.email) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const result = await this.unidadResidencialService.delete(params.id, auth.user.email)
      
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Subir logo para una unidad residencial
   */
  public async uploadLogo({ params, request, response, auth }: HttpContext) {
    try {
      if (!auth?.user?.email) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      // Obtener el archivo del request
      const logoFile = request.file('logo', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      })

      if (!logoFile) {
        return response.badRequest({ error: 'No se ha enviado ningún archivo de logo' })
      }

      const result = await this.unidadResidencialService.uploadLogo(
        params.id, 
        auth.user.email, 
        logoFile
      )

      return response.ok({
        message: 'Logo de unidad residencial guardado exitosamente',
        data: {
          logo_url: result.logoUrl,
          unidad_residencial: result.unidadResidencial
        }
      })

    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
