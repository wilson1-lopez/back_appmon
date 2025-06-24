import { HttpContext } from '@adonisjs/core/http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import app from '@adonisjs/core/services/app'

export default class FileController {
  /**
   * Servir logos de empresas
   */
  public async serveLogo({ params, response }: HttpContext) {
    try {
      const filename = params.filename
      const filePath = join(app.makePath('public'), 'uploads', 'logos', filename)
      const file = await readFile(filePath)
      
      // Determinar el tipo de contenido basado en la extensión
      const ext = filename.split('.').pop()?.toLowerCase()
      let contentType = 'image/jpeg'
      
      switch (ext) {
        case 'png':
          contentType = 'image/png'
          break
        case 'webp':
          contentType = 'image/webp'
          break
        case 'jpg':
        case 'jpeg':
        default:
          contentType = 'image/jpeg'
          break
      }
      
      response.header('Content-Type', contentType)
      response.header('Cache-Control', 'public, max-age=31536000') // Cache por 1 año
      return response.send(file)
    } catch (error) {
      return response.notFound({ error: 'Archivo no encontrado' })
    }
  }
}
