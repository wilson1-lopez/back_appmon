import TipoVehiculo from '#models/TipoVehiculo'

export default class TipoVehiculoService {
  /**
   * Obtiene todos los tipos de vehículos ordenados por ID
   */
  async getAllTiposVehiculo() {
    return await TipoVehiculo.query().orderBy('id', 'asc')
  }

  /**
   * Obtiene un tipo de vehículo por ID
   */
  async getTipoVehiculoById(id: number) {
    return await TipoVehiculo.findOrFail(id)
  }

  /**
   * Obtiene un tipo de vehículo por código
   */
  async getTipoVehiculoByCodigo(codigo: string) {
    return await TipoVehiculo.findByOrFail('codigo', codigo)
  }

  /**
   * Crea un nuevo tipo de vehículo
   */
  async createTipoVehiculo(data: { codigo: string; nombre: string }) {
    return await TipoVehiculo.create(data)
  }

  /**
   * Actualiza un tipo de vehículo
   */
  async updateTipoVehiculo(id: number, data: { codigo?: string; nombre?: string }) {
    const tipoVehiculo = await TipoVehiculo.findOrFail(id)
    tipoVehiculo.merge(data)
    await tipoVehiculo.save()
    return tipoVehiculo
  }

  /**
   * Elimina un tipo de vehículo
   */
  async deleteTipoVehiculo(id: number) {
    const tipoVehiculo = await TipoVehiculo.findOrFail(id)
    await tipoVehiculo.delete()
    return { message: 'Tipo de vehículo eliminado exitosamente' }
  }
}
