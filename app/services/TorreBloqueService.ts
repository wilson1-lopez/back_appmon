import TorreBloque from "#models/TorreBloque"


export default class TorreBloqueService {
  public async list() {
    return TorreBloque.all()
  }

  public async getById(id: string) {
    return TorreBloque.findOrFail(id)
  }

  public async create(data: Partial<TorreBloque>) {
    return TorreBloque.create(data)
  }

  public async update(id: string, data: Partial<TorreBloque>) {
    const torre = await TorreBloque.findOrFail(id)
    torre.merge(data)
    await torre.save()
    return torre
  }

  public async delete(id: string) {
    const torre = await TorreBloque.findOrFail(id)
    torre.estado = false
    await torre.save()
    return torre
  }

  public async byUnidad(unidadId: string) {
    return TorreBloque.query().where('unidad_id', unidadId).where('estado', true)
  }
}
