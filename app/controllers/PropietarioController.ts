import type { HttpContext } from '@adonisjs/core/http'


import PropietarioService from '#services/PropietarioService'
import { updatePropietarioValidator } from '#validators/PropietarioValidator'

export default class PropietarioController {
  private propietarioService = new PropietarioService()

  /**
   * Crear un nuevo propietario
   */
  async store({ request, response }: HttpContext) {
    try {
      // Extraer los datos del formulario
      const formData = request.only([
        'nombre',
        'apellido',
        'tipoDocumentoId',
        'documento',
        'telefono',
        'correo',
        'esResidente',
        'apartamentoId',
        'generoId',
        'unidadResidencialId'
      ])

      // Convertir string a number para campos numéricos
      if (formData.tipoDocumentoId) {
        formData.tipoDocumentoId = parseInt(formData.tipoDocumentoId)
      }
      if (formData.generoId) {
        formData.generoId = parseInt(formData.generoId)
      }

      // Convertir string a boolean para esResidente
      if (formData.esResidente !== undefined) {
        formData.esResidente = formData.esResidente === 'true' || formData.esResidente === true
      }

      // Obtener el archivo de foto (opcional)
      const fotoFile = request.file('foto', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      })

      // Validar datos básicos manualmente (ya que no podemos usar el validator con multipart)
      if (!formData.nombre || !formData.apellido || !formData.tipoDocumentoId || !formData.apartamentoId) {
        return response.status(400).json({
          success: false,
          message: 'Los campos nombre, apellido, tipoDocumentoId y apartamentoId son obligatorios',
        })
      }

      const propietario = await this.propietarioService.createPropietarioWithFoto(formData, fotoFile || undefined)

      return response.status(201).json({
        success: true,
        message: 'Propietario creado exitosamente',
        data: propietario,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al crear el propietario',
        error: error.message,
      })
    }
  }

  /**
   * Obtener todos los propietarios de un apartamento
   */
  async getByApartamento({ params, response }: HttpContext) {
    try {
      const { apartamentoId } = params
      const propietarios = await this.propietarioService.getPropietariosByApartamento(apartamentoId)

      return response.json({
        success: true,
        data: propietarios,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Error al obtener los propietarios',
        error: error.message,
      })
    }
  }

  /**
   * Obtener un propietario por ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const propietario = await this.propietarioService.getPropietarioById(id)

      return response.json({
        success: true,
        data: propietario,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Propietario no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un propietario
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const data = await request.validateUsing(updatePropietarioValidator)
      const fotoFile = request.file('foto', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      })
      const propietario = await this.propietarioService.updatePropietario(id, data, fotoFile || undefined)

      return response.json({
        success: true,
        message: 'Propietario actualizado exitosamente',
        data: propietario,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al actualizar el propietario',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un propietario
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      await this.propietarioService.deletePropietario(id)

      return response.json({
        success: true,
        message: 'Propietario eliminado exitosamente',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al eliminar el propietario',
        error: error.message,
      })
    }
  }

  /**
   * Asociar un propietario existente a un apartamento
   */
  async asociarApartamento({ request, response }: HttpContext) {
    try {
      const { propietarioId, apartamentoId, esResidente } = request.only(['propietarioId', 'apartamentoId', 'esResidente'])
      
      await this.propietarioService.asociarApartamento(propietarioId, apartamentoId, esResidente || false)

      return response.json({
        success: true,
        message: 'Propietario asociado al apartamento exitosamente',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al asociar propietario al apartamento',
        error: error.message,
      })
    }
  }

  /**
   * Desasociar un propietario de un apartamento
   */
  async desasociarApartamento({ request, response }: HttpContext) {
    try {
      const { propietarioId, apartamentoId } = request.only(['propietarioId', 'apartamentoId'])
      
      await this.propietarioService.desasociarApartamento(propietarioId, apartamentoId)

      return response.json({
        success: true,
        message: 'Propietario desasociado del apartamento exitosamente',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error al desasociar propietario del apartamento',
        error: error.message,
      })
    }
  }

  /**
   * Subir y guardar foto del propietario
   */
  public async uploadFoto({ params, request, response }: HttpContext) {
    try {
      const propietarioId = params.id

      // Obtener el archivo del request
      const fotoFile = request.file('foto', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      })

      if (!fotoFile) {
        return response.badRequest({ error: 'No se ha enviado ningún archivo de foto' })
      }

      // Usar el servicio para manejar la subida de la foto
      const result = await this.propietarioService.uploadFoto(propietarioId, fotoFile)

      return response.ok({
        message: 'Foto guardada exitosamente',
        data: {
          foto_url: result.fotoUrl,
          propietario: result.propietario
        }
      })

    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
