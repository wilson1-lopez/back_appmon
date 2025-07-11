import Agencia from '#models/Agencia'
import db from '@adonisjs/lucid/services/db'

export default class AgenciaService {
  /**
   * Crear una nueva agencia
   */
  public async createAgencia(data: {
    nombre: string
    contactoNombre?: string
    correo?: string
    telefono?: string
    direccion?: string
    ciudad?: string
  }) {
    // Verificar que el nombre no esté duplicado
    const existingAgencia = await Agencia.query()
      .where('nombre', 'ILIKE', data.nombre)
      .first()
    
    if (existingAgencia) {
      throw new Error('Ya existe una agencia con este nombre')
    }

    // Verificar email único si se proporciona
    if (data.correo) {
      const existingEmail = await Agencia.query()
        .where('correo', 'ILIKE', data.correo)
        .first()
      
      if (existingEmail) {
        throw new Error('Ya existe una agencia con este correo electrónico')
      }
    }

    // Crear la agencia
    const agencia = new Agencia()
    agencia.nombre = data.nombre
    agencia.contactoNombre = data.contactoNombre || null
    agencia.correo = data.correo || null
    agencia.telefono = data.telefono || null
    agencia.direccion = data.direccion || null
    agencia.ciudad = data.ciudad || null

    await agencia.save()
    return agencia
  }

  /**
   * Obtener todas las agencias con paginación
   */
  public async getAgencias(page: number = 1, limit: number = 10, filters?: {
    nombre?: string
    ciudad?: string
    correo?: string
  }) {
    const query = Agencia.query()

    // Aplicar filtros si existen
    if (filters?.nombre) {
      query.where('nombre', 'ILIKE', `%${filters.nombre}%`)
    }
    
    if (filters?.ciudad) {
      query.where('ciudad', 'ILIKE', `%${filters.ciudad}%`)
    }
    
    if (filters?.correo) {
      query.where('correo', 'ILIKE', `%${filters.correo}%`)
    }

    const agencias = await query
      .orderBy('nombre', 'asc')
      .paginate(page, limit)
    
    return agencias
  }

  /**
   * Obtener una agencia por ID
   */
  public async getAgenciaById(id: string) {
    const agencia = await Agencia.query()
      .where('id', id)
      .preload('apartamentos', (apartamentosQuery) => {
        apartamentosQuery.preload('torreBloque')
      })
      .first()
    
    if (!agencia) {
      throw new Error('Agencia no encontrada')
    }
    
    return agencia
  }

  /**
   * Actualizar una agencia
   */
  public async updateAgencia(id: string, data: Partial<{
    nombre: string
    contactoNombre?: string
    correo?: string
    telefono?: string
    direccion?: string
    ciudad?: string
  }>) {
    const agencia = await Agencia.find(id)
    if (!agencia) {
      throw new Error('Agencia no encontrada')
    }

    // Verificar nombre único si se está cambiando
    if (data.nombre && data.nombre !== agencia.nombre) {
      const existingAgencia = await Agencia.query()
        .where('nombre', 'ILIKE', data.nombre)
        .whereNot('id', id)
        .first()
      
      if (existingAgencia) {
        throw new Error('Ya existe una agencia con este nombre')
      }
    }

    // Verificar email único si se está cambiando
    if (data.correo && data.correo !== agencia.correo) {
      const existingEmail = await Agencia.query()
        .where('correo', 'ILIKE', data.correo)
        .whereNot('id', id)
        .first()
      
      if (existingEmail) {
        throw new Error('Ya existe una agencia con este correo electrónico')
      }
    }

    // Actualizar los campos
    Object.assign(agencia, data)
    await agencia.save()
    
    return agencia
  }

  /**
   * Eliminar una agencia
   */
  public async deleteAgencia(id: string) {
    const agencia = await Agencia.find(id)
    if (!agencia) {
      throw new Error('Agencia no encontrada')
    }

    // Verificar si tiene apartamentos asociados
    const apartamentosCount = await db.from('am_apto')
      .where('agencia_id', id)
      .count('* as total')
      .first()

    if (apartamentosCount && Number(apartamentosCount.total) > 0) {
      throw new Error('No se puede eliminar la agencia porque tiene apartamentos asociados')
    }

    await agencia.delete()
    return { message: 'Agencia eliminada exitosamente' }
  }

  /**
   * Obtener todas las agencias (sin paginación) para selects
   */
  public async getAllAgencias() {
    const agencias = await Agencia.query()
      .select('id', 'nombre', 'contacto_nombre', 'correo', 'telefono')
      .orderBy('nombre', 'asc')
    
    return agencias
  }

  /**
   * Buscar agencias por texto
   */
  public async searchAgencias(searchTerm: string, limit: number = 10) {
    const agencias = await Agencia.query()
      .where((query) => {
        query
          .where('nombre', 'ILIKE', `%${searchTerm}%`)
          .orWhere('contacto_nombre', 'ILIKE', `%${searchTerm}%`)
          .orWhere('correo', 'ILIKE', `%${searchTerm}%`)
          .orWhere('ciudad', 'ILIKE', `%${searchTerm}%`)
      })
      .orderBy('nombre', 'asc')
      .limit(limit)
    
    return agencias
  }

  /**
   * Obtener estadísticas de agencias
   */
  public async getAgenciasStats() {
    const [totalAgencias] = await db.from('am_agencias').count('* as total')
    
    const [agenciasConApartamentos] = await db.from('am_agencias')
      .whereExists((query) => {
        query.from('am_apto').whereRaw('am_apto.agencia_id = am_agencias.id')
      })
      .count('* as total')

    const [agenciasSinApartamentos] = await db.from('am_agencias')
      .whereNotExists((query) => {
        query.from('am_apto').whereRaw('am_apto.agencia_id = am_agencias.id')
      })
      .count('* as total')

    const agenciasPorCiudad = await db.from('am_agencias')
      .select('ciudad')
      .count('* as total')
      .whereNotNull('ciudad')
      .groupBy('ciudad')
      .orderBy('total', 'desc')
      .limit(10)

    return {
      total: Number(totalAgencias.total),
      conApartamentos: Number(agenciasConApartamentos.total),
      sinApartamentos: Number(agenciasSinApartamentos.total),
      porCiudad: agenciasPorCiudad.map(item => ({
        ciudad: item.ciudad,
        total: Number(item.total)
      }))
    }
  }

  /**
   * Obtener apartamentos de una agencia
   */
  public async getApartamentosByAgencia(agenciaId: string, page: number = 1, limit: number = 10) {
    const agencia = await Agencia.find(agenciaId)
    if (!agencia) {
      throw new Error('Agencia no encontrada')
    }

    const apartamentos = await db.from('am_apto')
      .join('am_torre_bloque', 'am_apto.torre_bloque_id', 'am_torre_bloque.id')
      .where('am_apto.agencia_id', agenciaId)
      .select(
        'am_apto.*',
        'am_torre_bloque.nombre as torre_bloque_nombre'
      )
      .orderBy('am_apto.numero_apto', 'asc')
      .paginate(page, limit)
    
    return apartamentos
  }
}
