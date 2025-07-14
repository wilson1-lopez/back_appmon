import db from '@adonisjs/lucid/services/db'
import Residente from '#models/Residente'
import Apto from '#models/Apto'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { mkdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class ResidenteService {
  /**
   * Crear un nuevo residente con foto opcional y asociarlo a un apartamento
   */
  async createResidenteWithFoto(
    data: {
      nombre: string
      apellido: string
      tipoDocumentoId: number
      documento?: string | null
      telefono?: string | null
      correo?: string | null
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
      const residente = await Residente.create(
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

      // Procesar la foto si se proporcionó
      if (fotoFile && fotoFile.isValid) {
        // Crear directorio de uploads/fotos si no existe
        const uploadsDir = join(app.makePath('public'), 'uploads', 'fotos')
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }

        // Generar nombre único para el archivo usando el ID real de la persona
        const fileExtension = fotoFile.extname
        const fileName = `${residente.id}_${cuid()}.${fileExtension}`
        
        // Mover el archivo a la ubicación final
        await fotoFile.move(uploadsDir, {
          name: fileName
        })

        // Construir la URL de la foto
        const fotoUrl = `/uploads/fotos/${fileName}`
        
        // Actualizar la persona con la URL de la foto
        residente.fotoUrl = fotoUrl
        await residente.useTransaction(trx).save()
      }

      // Asociar la persona al apartamento en la tabla residentes (sin campos adicionales)
      await residente.related('apartamentos').attach({
        [data.apartamentoId]: {}
      }, trx)

      await trx.commit()

      // Cargar las relaciones para el retorno
      await residente.load('apartamentos')
      await residente.load('unidadResidencial')

      return residente
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Crear un nuevo residente y asociarlo a un apartamento
   */
  async createResidente(data: {
    nombre: string
    apellido: string
    tipoDocumentoId: number
    documento?: string | null
    telefono?: string | null
    correo?: string | null
    fotoUrl?: string | null
    apartamentoId: string
    generoId?: number | null
    unidadResidencialId?: string | null
  }) {
    const trx = await db.transaction()

    try {
      // Verificar que el apartamento existe
      await Apto.findOrFail(data.apartamentoId)

      // Crear la persona (residente)
      const residente = await Residente.create(
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

      // Asociar la persona al apartamento en la tabla residentes (sin campos adicionales)
      await residente.related('apartamentos').attach({
        [data.apartamentoId]: {}
      }, trx)

      await trx.commit()

      // Cargar las relaciones para el retorno
      await residente.load('apartamentos')
      await residente.load('unidadResidencial')

      return residente
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Obtener todos los residentes de un apartamento
   */
  async getResidentesByApartamento(apartamentoId: string) {
    await Apto.findOrFail(apartamentoId)
    
    const residentes = await db
      .from('am_personas')
      .join('am_residentes_x_apto', 'am_personas.id', 'am_residentes_x_apto.residente_id')
      .join('am_tipos_documento', 'am_personas.tipo_documento_id', 'am_tipos_documento.id')
      .join('am_tipos_documento_base', 'am_tipos_documento.tipo_base_id', 'am_tipos_documento_base.id')
      .where('am_residentes_x_apto.apartamento_id', apartamentoId)
      .select(
        'am_personas.*',
        'am_tipos_documento_base.nombre as tipo_documento_nombre'
      )

    return residentes
  }

  /**
   * Obtener un residente por ID con sus apartamentos
   */
  async getResidenteById(id: string) {
    const residente = await Residente.findOrFail(id)
    await residente.load('apartamentos')
    await residente.load('unidadResidencial')
    return residente
  }

  /**
   * Actualizar un residente
   */
  async updateResidente(
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
    const residente = await Residente.findOrFail(id)
    residente.merge(data)
    await residente.save()
    
    await residente.load('apartamentos')
    await residente.load('unidadResidencial')
    
    return residente
  }

  /**
   * Actualizar un residente con foto opcional
   */
  async updateResidenteWithFoto(
    id: string,
    data: {
      nombre?: string
      apellido?: string
      tipoDocumentoId?: number
      documento?: string | null
      telefono?: string | null
      correo?: string | null
      generoId?: number | null
      unidadResidencialId?: string | null
    },
    fotoFile?: MultipartFile
  ) {
    const trx = await db.transaction()

    try {
      const residente = await Residente.findOrFail(id)
      
      // Procesar la foto si se proporcionó
      if (fotoFile && fotoFile.isValid) {
        // Crear directorio de uploads/fotos si no existe
        const uploadsDir = join(app.makePath('public'), 'uploads', 'fotos')
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }

        // Eliminar foto anterior si existe
        if (residente.fotoUrl) {
          try {
            // Extraer el nombre del archivo de la URL
            const oldFileName = residente.fotoUrl.split('/').pop()
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
        const fileName = `${id}_${cuid()}.${fileExtension}`
        
        // Mover el archivo a la ubicación final
        await fotoFile.move(uploadsDir, {
          name: fileName
        })

        // Construir la URL de la foto
        const fotoUrl = `/uploads/fotos/${fileName}`

        // Actualizar los datos incluyendo la nueva foto
        const updatedData = {
          ...data,
          fotoUrl: fotoUrl
        }
        residente.merge(updatedData)
      } else {
        // Solo actualizar los datos sin cambiar la foto
        residente.merge(data)
      }

      await residente.useTransaction(trx).save()
      await trx.commit()

      // Cargar las relaciones para el retorno
      await residente.load('apartamentos')
      await residente.load('unidadResidencial')

      return residente
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Eliminar un residente y todas sus asociaciones
   * Si el residente también es propietario, solo se desasocia como residente
   * Si solo es residente, se elimina completamente
   */
  async deleteResidente(id: string) {
    const trx = await db.transaction()

    try {
      const residente = await Residente.findOrFail(id)

      // Verificar si la persona también es propietario
      const esPropietario = await db
        .from('am_propietarios_x_apto')
        .where('propietario_id', id)
        .first()

      // Desasociar de todos los apartamentos como residente
      await residente.related('apartamentos').detach([], trx)

      if (esPropietario) {
        // Si es propietario, actualizar es_residente a false en am_propietarios_x_apto
        await db.from('am_propietarios_x_apto').where('propietario_id', id).update({ es_residente: false }).useTransaction(trx)
      } else {
        // Si no es propietario, eliminarlo completamente
        await residente.useTransaction(trx).delete()
      }

      await trx.commit()

      return {
        eliminado: !esPropietario,
        mensaje: esPropietario 
          ? 'Residente desasociado (mantiene rol de propietario y esResidente=false)'
          : 'Residente eliminado completamente'
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Asociar un residente existente a un apartamento
   */
  async asociarApartamento(residenteId: string, apartamentoId: string) {
    const residente = await Residente.findOrFail(residenteId)
    await Apto.findOrFail(apartamentoId)

    // Verificar si ya existe la asociación
    const existingRelation = await db
      .from('am_residentes_x_apto')
      .where('residente_id', residenteId)
      .where('apartamento_id', apartamentoId)
      .first()

    if (existingRelation) {
      throw new Error('El residente ya está asociado a este apartamento')
    }

    await residente.related('apartamentos').attach({
      [apartamentoId]: {}
    })
  }

  /**
   * Desasociar un residente de un apartamento
   */
  async desasociarApartamento(residenteId: string, apartamentoId: string) {
    const residente = await Residente.findOrFail(residenteId)
    await Apto.findOrFail(apartamentoId)

    // Verificar si existe la asociación
    const existingRelation = await db
      .from('am_residentes_x_apto')
      .where('residente_id', residenteId)
      .where('apartamento_id', apartamentoId)
      .first()

    if (!existingRelation) {
      throw new Error('El residente no está asociado a este apartamento')
    }

    await residente.related('apartamentos').detach([apartamentoId])
  }
}