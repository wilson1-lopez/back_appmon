import LocationService from "#services/LocationService"
import { HttpContext } from "@adonisjs/core/http"

export default class LocationController {
  private service = new LocationService()

  /**
   * Obtener todos los países
   */
  public async getCountries({ response }: HttpContext) {
    try {
      const countries = await this.service.getAllCountries()
      return response.ok({
        success: true,
        data: countries,
        message: 'Países obtenidos exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los países',
        error: error.message
      })
    }
  }

  /**
   * Obtener departamentos por país
   */
  public async getDepartmentsByCountry({ params, response }: HttpContext) {
    try {
      const countryId = Number(params.countryId)
      
      if (isNaN(countryId)) {
        return response.badRequest({
          success: false,
          message: 'ID de país inválido'
        })
      }

      const result = await this.service.getDepartmentsByCountry(countryId)
      
      if (!result) {
        return response.notFound({
          success: false,
          message: 'País no encontrado'
        })
      }

      return response.ok({
        success: true,
        data: result,
        message: 'Departamentos obtenidos exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los departamentos',
        error: error.message
      })
    }
  }

  /**
   * Obtener ciudades por departamento
   */
  public async getCitiesByDepartment({ params, response }: HttpContext) {
    try {
      const departmentId = Number(params.departmentId)
      
      if (isNaN(departmentId)) {
        return response.badRequest({
          success: false,
          message: 'ID de departamento inválido'
        })
      }

      const result = await this.service.getCitiesByDepartment(departmentId)
      
      if (!result) {
        return response.notFound({
          success: false,
          message: 'Departamento no encontrado'
        })
      }

      return response.ok({
        success: true,
        data: result,
        message: 'Ciudades obtenidas exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener las ciudades',
        error: error.message
      })
    }
  }

  /**
   * Obtener la jerarquía completa de un país (país -> departamentos -> ciudades)
   */
  public async getCompleteHierarchy({ params, response }: HttpContext) {
    try {
      const countryId = Number(params.countryId)
      
      if (isNaN(countryId)) {
        return response.badRequest({
          success: false,
          message: 'ID de país inválido'
        })
      }

      const result = await this.service.getCompleteHierarchyByCountry(countryId)
      
      if (!result) {
        return response.notFound({
          success: false,
          message: 'País no encontrado'
        })
      }

      return response.ok({
        success: true,
        data: result,
        message: 'Jerarquía completa obtenida exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener la jerarquía completa',
        error: error.message
      })
    }
  }

  /**
   * Obtener todos los tipos de documentos base
   */
  public async getBaseDocumentTypes({ response }: HttpContext) {
    try {
      const baseTypes = await this.service.getAllBaseDocumentTypes()
      return response.ok({
        success: true,
        data: baseTypes,
        message: 'Tipos de documentos base obtenidos exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los tipos de documentos base',
        error: error.message
      })
    }
  }

  /**
   * Obtener tipos de documentos por país
   */
  public async getDocumentTypesByCountry({ params, response }: HttpContext) {
    try {
      const { countryId } = params
      const documentTypes = await this.service.getDocumentTypesByCountry(parseInt(countryId))
      
      return response.ok({
        success: true,
        data: documentTypes,
        message: 'Tipos de documentos por país obtenidos exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener los tipos de documentos por país',
        error: error.message
      })
    }
  }

  /**
   * Obtener todos los tipos de documentos con información completa
   */
  public async getAllDocumentTypes({ response }: HttpContext) {
    try {
      const documentTypes = await this.service.getAllDocumentTypes()
      return response.ok({
        success: true,
        data: documentTypes,
        message: 'Todos los tipos de documentos obtenidos exitosamente'
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error al obtener todos los tipos de documentos',
        error: error.message
      })
    }
  }
}
