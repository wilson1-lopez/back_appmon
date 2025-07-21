import { HttpContext } from '@adonisjs/core/http'
import CompanyService from '#services/CompanyService'

export default class CompanyController {
  private companyService = new CompanyService()

  /**
   * Obtener información completa de una empresa por ID
   */
  public async show({ params, response }: HttpContext) {
    try {
      const companyId = params.id
      const company = await this.companyService.getCompanyById(companyId)
      
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }

      return response.ok({ 
        message: 'Información de empresa obtenida exitosamente',
        data: company 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener información completa de una empresa por email
   */
  public async getByEmail({ params, response }: HttpContext) {
    try {
      const email = params.email
      const company = await this.companyService.getCompanyByEmail(email)
      
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }

      return response.ok({ 
        message: 'Información de empresa obtenida exitosamente',
        data: company 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Listar todas las empresas con información básica
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      
      const companies = await this.companyService.getCompanies({ page, limit, status })
      
      return response.ok({ 
        message: 'Lista de empresas obtenida exitosamente',
        data: companies 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }  /**
   * Actualizar información de la empresa
   * Solo permite actualizar: nombre, dirección, departamento, ciudad, teléfono y logo
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const companyId = params.id
      const updateData = request.only([
        'name',       // nombre de la empresa
        'address',    // dirección
        'phone',      // teléfono
        'logoUrl',    // logo de la empresa
        'cityId'      // ciudad (ID)
      ])
      
      const company = await this.companyService.updateCompany(companyId, updateData)
      
      return response.ok({ 
        message: 'Empresa actualizada exitosamente',
        data: company 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Subir y guardar logo de la empresa
   */
  public async uploadLogo({ params, request, response }: HttpContext) {    try {
      const companyId = params.id

      // Obtener el archivo del request
      const logoFile = request.file('logo', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      })

      if (!logoFile) {
        return response.badRequest({ error: 'No se ha enviado ningún archivo de logo' })
      }

      // Usar el servicio para manejar la subida del logo
      const result = await this.companyService.uploadLogo(companyId, logoFile)

      return response.ok({
        message: 'Logo guardado exitosamente',
        data: {
          logo_url: result.logoUrl,
          company: result.company
        }
      })

    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
