import TorreBloqueService from '#services/TorreBloqueService'
import { HttpContext } from '@adonisjs/core/http'



export default class TorreBloqueController {
  private service = new TorreBloqueService()

  public async index({ response }: HttpContext) {
    const data = await this.service.list()
    return response.ok(data)
  }

  public async show({ params, response }: HttpContext) {
    const data = await this.service.getById(params.id)
    return response.ok(data)
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['nombre', 'pisos', 'descripcion', 'unidadId'])
    const created = await this.service.create(data)
    return response.created(created)
  }

  public async update({ params, request, response }: HttpContext) {
    const data = request.only(['nombre', 'pisos', 'descripcion', 'unidadId'])
    const updated = await this.service.update(params.id, data)
    return response.ok(updated)
  }

  public async destroy({ params, response }: HttpContext) {
    await this.service.delete(params.id)
    return response.noContent()
  }

  public async byUnidad({ params, response }: HttpContext) {
    const data = await this.service.byUnidad(params.unidadId)
    return response.ok(data)
  }
}
