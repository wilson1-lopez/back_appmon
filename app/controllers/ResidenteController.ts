import type { HttpContext } from '@adonisjs/core/http'
import ResidenteService from '#services/ResidenteService'
import { createResidenteValidator, updateResidenteValidator } from '#validators/ResidenteValidator'

export default class ResidenteController {
  private residenteService = new ResidenteService()

  /**
   * Crear un nuevo residente
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createResidenteValidator)
      // Eliminar generoId si es null o undefined para cumplir con el tipo requerido
      if (data.generoId == null) {
        delete data.generoId
      }
      const residente = await this.residenteService.createResidente(data as {
        nombre: string
        apellido: string
        tipoDocumentoId: number
        documento?: string | null
        telefono?: string | null
        correo?: string | null
        fotoUrl?: string | null
        apartamentoId: string
        generoId?: number
        unidadResidencialId?: string | null
      })

      return response.status(201).json({
        success: true,
        message: 'Residente creado exitosamente',
        data: residente,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al crear el residente',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo residente con foto
   */
  async storeWithFoto({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'nombre',
        'apellido',
        'tipoDocumentoId',
        'documento',
        'telefono',
        'correo',
        'apartamentoId',
        'generoId',
        'unidadResidencialId',
      ])

      // Convertir tipoDocumentoId y generoId a números si vienen como string
      if (data.tipoDocumentoId) {
        data.tipoDocumentoId = parseInt(data.tipoDocumentoId)
      }
      if (data.generoId) {
        data.generoId = parseInt(data.generoId)
      }

      const fotoFile = request.file('foto')
      const residente = await this.residenteService.createResidenteWithFoto(data, fotoFile || undefined)

      return response.status(201).json({
        success: true,
        message: 'Residente creado exitosamente',
        data: residente,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al crear el residente',
        error: error.message,
      })
    }
  }

  /**
   * Obtener todos los residentes de un apartamento
   */
  async getByApartamento({ params, response }: HttpContext) {
    try {
      const { apartamentoId } = params
      const residentes = await this.residenteService.getResidentesByApartamento(apartamentoId)

      return response.json({
        success: true,
        message: 'Residentes obtenidos exitosamente',
        data: residentes,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al obtener residentes',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un residente por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const residente = await this.residenteService.getResidenteById(id)

      return response.json({
        success: true,
        message: 'Residente obtenido exitosamente',
        data: residente,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al obtener residente',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un residente
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const data = await request.validateUsing(updateResidenteValidator)
      const residente = await this.residenteService.updateResidente(id, data)

      return response.json({
        success: true,
        message: 'Residente actualizado exitosamente',
        data: residente,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al actualizar residente',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un residente con foto
   */
  async updateWithFoto({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const data = request.only([
        'nombre',
        'apellido',
        'tipoDocumentoId',
        'documento',
        'telefono',
        'correo',
        'generoId',
        'unidadResidencialId'
      ])

      // Convertir tipoDocumentoId y generoId a números si vienen como string
      if (data.tipoDocumentoId) {
        data.tipoDocumentoId = parseInt(data.tipoDocumentoId)
      }
      if (data.generoId) {
        data.generoId = parseInt(data.generoId)
      }

      const fotoFile = request.file('foto')
      const residente = await this.residenteService.updateResidenteWithFoto(id, data, fotoFile || undefined)

      return response.json({
        success: true,
        message: 'Residente actualizado exitosamente',
        data: residente,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al actualizar residente',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un residente
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const resultado = await this.residenteService.deleteResidente(id)

      return response.json({
        success: true,
        message: resultado.mensaje,
        data: resultado,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al eliminar residente',
        error: error.message,
      })
    }
  }

  /**
   * Asociar un residente existente a un apartamento
   */
  async asociarApartamento({ request, response }: HttpContext) {
    try {
      const { residenteId, apartamentoId } = request.only(['residenteId', 'apartamentoId'])
      
      if (!residenteId || !apartamentoId) {
        return response.status(400).json({
          success: false,
          message: 'Los campos residenteId y apartamentoId son obligatorios',
        })
      }

      await this.residenteService.asociarApartamento(residenteId, apartamentoId)

      return response.json({
        success: true,
        message: 'Residente asociado al apartamento exitosamente',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al asociar residente al apartamento',
        error: error.message,
      })
    }
  }

  /**
   * Desasociar un residente de un apartamento
   */
  async desasociarApartamento({ request, response }: HttpContext) {
    try {
      const { residenteId, apartamentoId } = request.only(['residenteId', 'apartamentoId'])
      
      if (!residenteId || !apartamentoId) {
        return response.status(400).json({
          success: false,
          message: 'Los campos residenteId y apartamentoId son obligatorios',
        })
      }

      await this.residenteService.desasociarApartamento(residenteId, apartamentoId)

      return response.json({
        success: true,
        message: 'Residente desasociado del apartamento exitosamente',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al desasociar residente del apartamento',
        error: error.message,
      })
    }
  }
}
