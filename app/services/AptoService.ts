import Apto from '#models/Apto'
import TorreBloque from '#models/TorreBloque'
import db from '@adonisjs/lucid/services/db'

export default class AptoService {
  /**
   * Crear un nuevo apartamento
   */
  public async createApto(data: {
    torreBloqueId: string
    numeroApto: string
    nroParqueadero?: string
    coeficiente?: number
    numeroCuartoUtil?: string
    areaLibre?: string
    coeApto?: number
    coeParqueadero?: number
    coeCuartoUtil?: number
    coeAreaLibre?: number
    facturaDigital?: boolean
    estadoId: number
    alquilado?: boolean
    agenciaId?: string
  }) {
    // Verificar que la torre/bloque existe
    const torreBloque = await TorreBloque.find(data.torreBloqueId)
    if (!torreBloque) {
      throw new Error('La torre/bloque especificada no existe')
    }

    // Verificar que el número de apartamento no esté duplicado en la misma torre/bloque
    const existingApto = await Apto.query()
      .where('torre_bloque_id', data.torreBloqueId)
      .where('numero_apto', data.numeroApto)
      .first()
    
    if (existingApto) {
      throw new Error('Ya existe un apartamento con este número en la torre/bloque seleccionada')
    }

    // Crear el apartamento
    const apto = new Apto()
    apto.torreBloqueId = data.torreBloqueId
    apto.numeroApto = data.numeroApto
    apto.nroParqueadero = data.nroParqueadero || null
    apto.coeficiente = data.coeficiente || null
    apto.numeroCuartoUtil = data.numeroCuartoUtil || null
    apto.areaLibre = data.areaLibre || null
    apto.coeApto = data.coeApto || null
    apto.coeParqueadero = data.coeParqueadero || null
    apto.coeCuartoUtil = data.coeCuartoUtil || null
    apto.coeAreaLibre = data.coeAreaLibre || null
    apto.facturaDigital = data.facturaDigital ?? false
    apto.estadoId = data.estadoId
    apto.alquilado = data.alquilado ?? false
    apto.agenciaId = data.agenciaId || null

    await apto.save()
    
    // Cargar la relación con torre/bloque para retornar datos completos
    await apto.load('torreBloque')
    
    return apto
  }

  /**
   * Obtener todos los apartamentos con paginación
   */
  public async getAptos(page: number = 1, limit: number = 10, filters?: {
    torreBloqueId?: string
    estadoId?: number
    alquilado?: boolean
    numeroApto?: string
  }) {
    const query = Apto.query()
      .preload('torreBloque')
      .preload('agencia')

    // Aplicar filtros si existen
    if (filters?.torreBloqueId) {
      query.where('torre_bloque_id', filters.torreBloqueId)
    }
    
    if (filters?.estadoId) {
      query.where('estado_id', filters.estadoId)
    }
    
    if (filters?.alquilado !== undefined) {
      query.where('alquilado', filters.alquilado)
    }
    
    if (filters?.numeroApto) {
      query.where('numero_apto', 'ILIKE', `%${filters.numeroApto}%`)
    }

    const aptos = await query.paginate(page, limit)
    return aptos
  }

  /**
   * Obtener un apartamento por ID
   */
  public async getAptoById(id: string) {
    const apto = await Apto.query()
      .where('id', id)
      .preload('torreBloque')
      .preload('agencia')
      .first()
    
    if (!apto) {
      throw new Error('Apartamento no encontrado')
    }
    
    return apto
  }

  /**
   * Actualizar un apartamento
   */
  public async updateApto(id: string, data: Partial<{
    torreBloqueId: string
    numeroApto: string
    nroParqueadero?: string
    coeficiente?: number
    numeroCuartoUtil?: string
    areaLibre?: string
    coeApto?: number
    coeParqueadero?: number
    coeCuartoUtil?: number
    coeAreaLibre?: number
    facturaDigital?: boolean
    estadoId: number
    alquilado?: boolean
    agenciaId?: string
  }>) {
    const apto = await Apto.find(id)
    if (!apto) {
      throw new Error('Apartamento no encontrado')
    }

    // Si se está cambiando la torre/bloque o número de apartamento, verificar duplicados
    if (data.torreBloqueId || data.numeroApto) {
      const torreBloqueId = data.torreBloqueId || apto.torreBloqueId
      const numeroApto = data.numeroApto || apto.numeroApto
      
      const existingApto = await Apto.query()
        .where('torre_bloque_id', torreBloqueId)
        .where('numero_apto', numeroApto)
        .whereNot('id', id)
        .first()
      
      if (existingApto) {
        throw new Error('Ya existe un apartamento con este número en la torre/bloque seleccionada')
      }
    }

    // Actualizar los campos
    Object.assign(apto, data)
    await apto.save()
    
    // Cargar la relación actualizada
    await apto.load('torreBloque')
    
    return apto
  }

  /**
   * Eliminar un apartamento
   */
  public async deleteApto(id: string) {
    const apto = await Apto.find(id)
    if (!apto) {
      throw new Error('Apartamento no encontrado')
    }

    await apto.delete()
    return { message: 'Apartamento eliminado exitosamente' }
  }

  /**
   * Obtener apartamentos por torre/bloque
   */
  public async getAptosByTorreBloque(torreBloqueId: string, page: number = 1, limit: number = 10) {
    // Verificar que la torre/bloque existe
    const torreBloque = await TorreBloque.find(torreBloqueId)
    if (!torreBloque) {
      throw new Error('La torre/bloque especificada no existe')
    }

    const aptos = await Apto.query()
      .where('torre_bloque_id', torreBloqueId)
      .preload('torreBloque')
      .orderBy('numero_apto', 'asc')
      .paginate(page, limit)
    
    return aptos
  }

  /**
   * Obtener estadísticas de apartamentos
   */
  public async getAptosStats(torreBloqueId?: string) {
    const query = db.from('am_apto')
    
    if (torreBloqueId) {
      query.where('torre_bloque_id', torreBloqueId)
    }

    const [totalAptos] = await query.count('* as total')
    const [alquilados] = await query.clone().where('alquilado', true).count('* as total')
    const [disponibles] = await query.clone().where('alquilado', false).count('* as total')
    const [facturaDigital] = await query.clone().where('factura_digital', true).count('* as total')

    return {
      total: Number(totalAptos.total),
      alquilados: Number(alquilados.total),
      disponibles: Number(disponibles.total),
      facturaDigital: Number(facturaDigital.total),
    }
  }
}
