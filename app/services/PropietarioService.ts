import db from '@adonisjs/lucid/services/db'
import Persona from '#models/Persona'
import Apto from '#models/Apto'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { mkdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class PropietarioService {
  /**
   * Crear un nuevo propietario con foto opcional y asociarlo a un apartamento
   */
  async createPropietarioWithFoto(
    data: {
      nombre: string
      apellido: string
      tipoDocumentoId: number
      documento?: string | null
      telefono?: string | null
      correo?: string | null
      esResidente?: boolean
      apartamentoId: string
      generoId?: number | null
      unidadResidencialId?: string | null
    },
    fotoFile?: MultipartFile
  ) {
    const trx = await db.transaction()

    try {
      // Verificar que el apartamento existe
      await Apto.findOrFail(data.apartamentoId)

      // Crear la persona primero (sin foto)
      const persona = await Persona.create(
        {
          nombre: data.nombre,
          apellido: data.apellido,
          tipoDocumentoId: data.tipoDocumentoId,
          documento: data.documento,
          telefono: data.telefono,
          correo: data.correo,
          fotoUrl: null, // Se actualizará después si hay foto
          generoId: data.generoId,
          unidadResidencialId: data.unidadResidencialId,
        },
        { client: trx }
      )

      // Si hay archivo de foto, procesarlo
      if (fotoFile && fotoFile.isValid) {
        // Crear directorio de uploads si no existe
        const uploadsDir = join(app.makePath('public'), 'uploads', 'fotos')
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }

        // Generar nombre único para el archivo usando el ID real de la persona
        const fileExtension = fotoFile.extname
        const fileName = `${persona.id}_${cuid()}.${fileExtension}`
        
        // Mover el archivo a la ubicación final
        await fotoFile.move(uploadsDir, {
          name: fileName
        })

        // Construir la URL de la foto
        const fotoUrl = `/uploads/fotos/${fileName}`
        
        // Actualizar la persona con la URL de la foto
        persona.fotoUrl = fotoUrl
        await persona.useTransaction(trx).save()
      }

      // Asociar la persona al apartamento en la tabla propietarios con el campo es_residente
      await persona.related('apartamentos').attach({
        [data.apartamentoId]: {
          es_residente: data.esResidente ?? false, // Por defecto false para propietarios
        }
      }, trx)

      // Si es residente, también registrarlo en la tabla de residentes
      if (data.esResidente === true) {
        await trx
          .table('am_residentes_x_apto')
          .insert({
            apartamento_id: data.apartamentoId,
            residente_id: persona.id,
            created_at: new Date(),
            updated_at: new Date()
          })
      }

      await trx.commit()

      // Cargar las relaciones para el retorno
      await persona.load('apartamentos')
      await persona.load('unidadResidencial')

      return persona
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Crear un nuevo propietario y asociarlo a un apartamento
   */
  async createPropietario(data: {
    nombre: string
    apellido: string
    tipoDocumentoId: number
    documento?: string | null
    telefono?: string | null
    correo?: string | null
    fotoUrl?: string | null
    esResidente?: boolean
    apartamentoId: string
    generoId?: number | null
    unidadResidencialId?: string | null
  }) {
    const trx = await db.transaction()

    try {
      // Verificar que el apartamento existe
      await Apto.findOrFail(data.apartamentoId)

      // Crear la persona (sin el campo esResidente que ya no está en am_personas)
      const persona = await Persona.create(
        {
          nombre: data.nombre,
          apellido: data.apellido,
          tipoDocumentoId: data.tipoDocumentoId,
          documento: data.documento,
          telefono: data.telefono,
          correo: data.correo,
          fotoUrl: data.fotoUrl,
          generoId: data.generoId,
          unidadResidencialId: data.unidadResidencialId,
        },
        { client: trx }
      )

      // Asociar la persona al apartamento en la tabla propietarios con el campo es_residente
      await persona.related('apartamentos').attach({
        [data.apartamentoId]: {
          es_residente: data.esResidente ?? false, // Por defecto false para propietarios
        }
      }, trx)

      // Si es residente, también registrarlo en la tabla de residentes
      if (data.esResidente === true) {
        await trx
          .table('am_residentes_x_apto')
          .insert({
            apartamento_id: data.apartamentoId,
            residente_id: persona.id,
            created_at: new Date(),
            updated_at: new Date()
          })
      }

      await trx.commit()

      // Cargar las relaciones para el retorno
      await persona.load('apartamentos')
      await persona.load('unidadResidencial')

      return persona
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Obtener todos los propietarios de un apartamento
   */
  async getPropietariosByApartamento(apartamentoId: string) {
    await Apto.findOrFail(apartamentoId)
    
    const propietarios = await db
      .from('am_personas')
      .join('am_propietarios_x_apto', 'am_personas.id', 'am_propietarios_x_apto.propietario_id')
      .where('am_propietarios_x_apto.apartamento_id', apartamentoId)
      .select('am_personas.*', 'am_propietarios_x_apto.es_residente')

    return propietarios
  }

  /**
   * Obtener un propietario por ID con sus apartamentos
   */
  async getPropietarioById(id: string) {
    const propietario = await Persona.findOrFail(id)
    await propietario.load('apartamentos')
    await propietario.load('unidadResidencial')
    return propietario
  }

  /**
   * Actualizar un propietario
   */
  async updatePropietario(
    id: string,
    data: {
      nombre?: string
      apellido?: string
      tipoDocumentoId?: number
      documento?: string | null
      telefono?: string | null
      correo?: string | null
      fotoUrl?: string | null
      generoId?: number | null
      unidadResidencialId?: string | null
    }
  ) {
    const propietario = await Persona.findOrFail(id)
    propietario.merge(data)
    await propietario.save()
    
    await propietario.load('apartamentos')
    await propietario.load('unidadResidencial')
    
    return propietario
  }

  /**
   * Eliminar un propietario y todas sus asociaciones
   */
  async deletePropietario(id: string) {
    const trx = await db.transaction()

    try {
      const propietario = await Persona.findOrFail(id)

      // Desasociar de todos los apartamentos (propietarios)
      await propietario.related('apartamentos').detach([], trx)

      // Eliminar todas las asociaciones de la tabla de residentes
      await trx
        .from('am_residentes_x_apto')
        .where('residente_id', id)
        .delete()

      // Eliminar la persona
      await propietario.useTransaction(trx).delete()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Asociar un propietario existente a un apartamento
   */
  async asociarApartamento(propietarioId: string, apartamentoId: string, esResidente: boolean = false) {
    const trx = await db.transaction()

    try {
      const propietario = await Persona.findOrFail(propietarioId)
      await Apto.findOrFail(apartamentoId)

      // Verificar si ya existe la asociación en propietarios
      const existingRelation = await db
        .from('am_propietarios_x_apto')
        .where('propietario_id', propietarioId)
        .where('apartamento_id', apartamentoId)
        .first()

      if (existingRelation) {
        throw new Error('El propietario ya está asociado a este apartamento')
      }

      // Asociar como propietario
      await propietario.related('apartamentos').attach({
        [apartamentoId]: {
          es_residente: esResidente,
        }
      }, trx)

      // Si es residente, también registrarlo en la tabla de residentes
      if (esResidente === true) {
        // Verificar si ya existe en la tabla de residentes
        const existingResident = await trx
          .from('am_residentes_x_apto')
          .where('residente_id', propietarioId)
          .where('apartamento_id', apartamentoId)
          .first()

        if (!existingResident) {
          await trx
            .table('am_residentes_x_apto')
            .insert({
              apartamento_id: apartamentoId,
              residente_id: propietarioId,
              created_at: new Date(),
              updated_at: new Date()
            })
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Desasociar un propietario de un apartamento
   */
  async desasociarApartamento(propietarioId: string, apartamentoId: string) {
    const trx = await db.transaction()

    try {
      const propietario = await Persona.findOrFail(propietarioId)
      await Apto.findOrFail(apartamentoId)

      // Verificar si existe la asociación
      const existingRelation = await db
        .from('am_propietarios_x_apto')
        .where('propietario_id', propietarioId)
        .where('apartamento_id', apartamentoId)
        .first()

      if (!existingRelation) {
        throw new Error('El propietario no está asociado a este apartamento')
      }

      // Desasociar de la tabla de propietarios
      await propietario.related('apartamentos').detach([apartamentoId], trx)

      // Si era residente, también eliminarlo de la tabla de residentes
      await trx
        .from('am_residentes_x_apto')
        .where('residente_id', propietarioId)
        .where('apartamento_id', apartamentoId)
        .delete()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Actualizar el estado "es_residente" de un propietario en un apartamento específico
   */
  async updateEsResidente(propietarioId: string, apartamentoId: string, esResidente: boolean) {
    const trx = await db.transaction()

    try {
      await Persona.findOrFail(propietarioId)
      await Apto.findOrFail(apartamentoId)

      // Verificar si existe la asociación
      const existingRelation = await db
        .from('am_propietarios_x_apto')
        .where('propietario_id', propietarioId)
        .where('apartamento_id', apartamentoId)
        .first()

      if (!existingRelation) {
        throw new Error('El propietario no está asociado a este apartamento')
      }

      // Actualizar el campo es_residente en la tabla de propietarios
      await trx
        .from('am_propietarios_x_apto')
        .where('propietario_id', propietarioId)
        .where('apartamento_id', apartamentoId)
        .update({ es_residente: esResidente })

      // Manejar la tabla de residentes según el nuevo estado
      if (esResidente === true) {
        // Verificar si ya existe en la tabla de residentes
        const existingResident = await trx
          .from('am_residentes_x_apto')
          .where('residente_id', propietarioId)
          .where('apartamento_id', apartamentoId)
          .first()

        // Si no existe, agregarlo
        if (!existingResident) {
          await trx
            .table('am_residentes_x_apto')
            .insert({
              apartamento_id: apartamentoId,
              residente_id: propietarioId,
              created_at: new Date(),
              updated_at: new Date()
            })
        }
      } else {
        // Si ya no es residente, eliminarlo de la tabla de residentes
        await trx
          .from('am_residentes_x_apto')
          .where('residente_id', propietarioId)
          .where('apartamento_id', apartamentoId)
          .delete()
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Subir y guardar foto del propietario
   */
  public async uploadFoto(propietarioId: string, fotoFile: MultipartFile) {
    // Verificar que el propietario existe
    const persona = await Persona.find(propietarioId)
    if (!persona) {
      throw new Error('Propietario no encontrado')
    }

    // Validar el archivo
    if (!fotoFile.isValid) {
      throw new Error(`Archivo inválido: ${fotoFile.errors.map(e => e.message).join(', ')}`)
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = join(app.makePath('public'), 'uploads', 'fotos')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Eliminar foto anterior si existe
    if (persona.fotoUrl) {
      try {
        // Extraer el nombre del archivo de la URL
        const oldFileName = persona.fotoUrl.split('/').pop()
        if (oldFileName) {
          const oldFilePath = join(uploadsDir, oldFileName)
          if (existsSync(oldFilePath)) {
            await unlink(oldFilePath)
          }
        }
      } catch (error) {
        // Log del error pero continúa con el proceso de subida
        console.warn('Error al eliminar foto anterior:', error)
      }
    }

    // Generar nombre único para el archivo
    const fileExtension = fotoFile.extname
    const fileName = `${propietarioId}_${cuid()}.${fileExtension}`
    
    // Mover el archivo a la ubicación final
    await fotoFile.move(uploadsDir, {
      name: fileName
    })

    // Construir la URL de la foto
    const fotoUrl = `/uploads/fotos/${fileName}`

    // Actualizar el propietario con la nueva URL de la foto
    persona.fotoUrl = fotoUrl
    await persona.save()

    // Retornar el propietario actualizado con sus relaciones
    const propietarioActualizado = await this.getPropietarioById(propietarioId)

    return {
      fotoUrl,
      propietario: propietarioActualizado
    }
  }
}
