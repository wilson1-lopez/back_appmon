import Visitante from '../models/Visitante.js'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { cuid } from '@adonisjs/core/helpers'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class VisitanteService {
  public static async registrar(data: Partial<Visitante>, fotoFile?: MultipartFile) {
    // Crear el visitante primero (sin foto)
    const visitante = await Visitante.create(data)

    // Si hay archivo de foto, procesarlo y actualizar el visitante
    if (fotoFile && fotoFile.isValid) {
      const uploadsDir = join(app.makePath('public'), 'uploads', 'fotos')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      const fileExtension = fotoFile.extname
      const fileName = `${visitante.id}_${cuid()}.${fileExtension}`
      await fotoFile.move(uploadsDir, { name: fileName })
      visitante.foto_url = `/uploads/fotos/${fileName}`
      await visitante.save()
    }
    return visitante
  }

  public static async obtenerPorUnidadResidencial(unidadResidencialId: string) {
    return await Visitante.query().where('unidad_residencial_id', unidadResidencialId)
  }
}
