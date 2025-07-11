import VehiculoApto from '#models/VehiculoApto'
import Apto from '#models/Apto'
import TipoVehiculo from '#models/TipoVehiculo'
import { Exception } from '@adonisjs/core/exceptions'

export default class VehiculoAptoService {
  /**
   * Obtiene todos los vehículos de apartamentos
   */
  async getAllVehiculos() {
    return await VehiculoApto.query()
      .preload('apartamento')
      .preload('tipoVehiculo')
      .orderBy('created_at', 'desc')
  }

  /**
   * Obtiene un vehículo por ID
   */
  async getVehiculoById(id: string) {
    const vehiculo = await VehiculoApto.query()
      .where('id', id)
      .preload('apartamento')
      .preload('tipoVehiculo')
      .first()

    if (!vehiculo) {
      throw new Exception('Vehículo no encontrado', { status: 404 })
    }

    return vehiculo
  }

  /**
   * Obtiene los vehículos de un apartamento específico
   */
  async getVehiculosByApartamento(apartamentoId: string) {
    // Verificar que el apartamento existe
    const apartamento = await Apto.find(apartamentoId)
    if (!apartamento) {
      throw new Exception('Apartamento no encontrado', { status: 404 })
    }

    return await VehiculoApto.query()
      .where('apartamento_id', apartamentoId)
      .preload('apartamento')
      .preload('tipoVehiculo')
      .orderBy('created_at', 'desc')
  }

  /**
   * Crea un nuevo vehículo para un apartamento
   */
  async createVehiculo(data: {
    apartamento_id: string
    tipo_id: number
    placa?: string
    otro_tipo_descripcion?: string
  }) {
    // Verificar que el apartamento existe
    const apartamento = await Apto.find(data.apartamento_id)
    if (!apartamento) {
      throw new Exception('Apartamento no encontrado', { status: 404 })
    }

    // Verificar que el tipo de vehículo existe
    const tipoVehiculo = await TipoVehiculo.find(data.tipo_id)
    if (!tipoVehiculo) {
      throw new Exception('Tipo de vehículo no encontrado', { status: 404 })
    }

    // Verificar si ya existe un vehículo con la misma placa (si se proporciona)
    if (data.placa) {
      const vehiculoExistente = await VehiculoApto.query()
        .where('placa', data.placa)
        .where('apartamento_id', data.apartamento_id)
        .first()

      if (vehiculoExistente) {
        throw new Exception('Ya existe un vehículo con esta placa en este apartamento', { status: 409 })
      }
    }

    const vehiculo = await VehiculoApto.create({
      apartamentoId: data.apartamento_id,
      tipoId: data.tipo_id,
      placa: data.placa,
      otroTipoDescripcion: data.otro_tipo_descripcion,
    })

    // Cargar las relaciones
    await vehiculo.load('apartamento')
    await vehiculo.load('tipoVehiculo')

    return vehiculo
  }

  /**
   * Actualiza un vehículo existente
   */
  async updateVehiculo(id: string, data: {
    apartamento_id?: string
    tipo_id?: number
    placa?: string
    otro_tipo_descripcion?: string
  }) {
    const vehiculo = await VehiculoApto.find(id)
    if (!vehiculo) {
      throw new Exception('Vehículo no encontrado', { status: 404 })
    }

    // Si se actualiza el apartamento, verificar que existe
    if (data.apartamento_id) {
      const apartamento = await Apto.find(data.apartamento_id)
      if (!apartamento) {
        throw new Exception('Apartamento no encontrado', { status: 404 })
      }
    }

    // Si se actualiza el tipo de vehículo, verificar que existe
    if (data.tipo_id) {
      const tipoVehiculo = await TipoVehiculo.find(data.tipo_id)
      if (!tipoVehiculo) {
        throw new Exception('Tipo de vehículo no encontrado', { status: 404 })
      }
    }

    // Verificar si ya existe un vehículo con la misma placa (si se proporciona)
    if (data.placa) {
      const vehiculoExistente = await VehiculoApto.query()
        .where('placa', data.placa)
        .where('apartamento_id', data.apartamento_id || vehiculo.apartamentoId)
        .whereNot('id', id)
        .first()

      if (vehiculoExistente) {
        throw new Exception('Ya existe un vehículo con esta placa en este apartamento', { status: 409 })
      }
    }

    vehiculo.merge({
      apartamentoId: data.apartamento_id,
      tipoId: data.tipo_id,
      placa: data.placa,
      otroTipoDescripcion: data.otro_tipo_descripcion,
    })

    await vehiculo.save()
    
    // Cargar las relaciones
    await vehiculo.load('apartamento')
    await vehiculo.load('tipoVehiculo')

    return vehiculo
  }

  /**
   * Elimina un vehículo
   */
  async deleteVehiculo(id: string) {
    const vehiculo = await VehiculoApto.find(id)
    if (!vehiculo) {
      throw new Exception('Vehículo no encontrado', { status: 404 })
    }

    await vehiculo.delete()
    return { message: 'Vehículo eliminado exitosamente' }
  }

  /**
   * Obtiene estadísticas de vehículos
   */
  async getEstadisticas() {
    const totalVehiculos = await VehiculoApto.query().count('* as total')
    const vehiculosPorTipo = await VehiculoApto.query()
      .join('am_tipos_vehiculo', 'am_vehiculos_x_apto.tipo_id', 'am_tipos_vehiculo.id')
      .groupBy('am_tipos_vehiculo.id', 'am_tipos_vehiculo.nombre')
      .select('am_tipos_vehiculo.nombre as tipo')
      .count('* as total')

    return {
      total: totalVehiculos[0].$extras.total,
      por_tipo: vehiculosPorTipo.map(item => ({
        tipo: item.$extras.tipo,
        total: item.$extras.total
      }))
    }
  }
}
