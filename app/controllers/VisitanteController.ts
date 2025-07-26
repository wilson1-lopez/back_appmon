import type { HttpContext } from '@adonisjs/core/http'
import VisitanteService from '../services/VisitanteService.js'

export default class VisitanteController {
  public async registrar({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'tipo_documento_id',
        'documento',
        'nombre',
        'unidad_residencial_id',
        'telefono',
        'correo'
      ])
      // Procesar archivo de foto si viene en la petición
      const fotoFile = request.file('foto', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp']
      })
      const visitante = await VisitanteService.registrar(data, fotoFile || undefined)
      return response.created({ visitante })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  public async listarPorUnidad({ request, response }: HttpContext) {
    try {
      const unidadResidencialId = request.param('unidad_residencial_id')
      if (!unidadResidencialId) {
        return response.badRequest({ error: 'unidad_residencial_id es requerido' })
      }
      const visitantes = await VisitanteService.obtenerPorUnidadResidencial(unidadResidencialId)
      return response.ok({ visitantes })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
