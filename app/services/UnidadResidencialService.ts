import UnidadResidencial from '#models/UnidadResidencial'
import Company from '#models/Company'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { mkdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import db from '@adonisjs/lucid/services/db'
import User from '#models/User'

export default class UnidadResidencialService {
  /**
   * Obtener unidades residenciales asociadas a un usuario según su rol
   */
  public async getUnidadesByUsuario(userId: string) {
    // Cargar usuario y roles
    const user = await User.query().where('id', userId).preload('roles').first()
    if (!user) throw new Error('Usuario no encontrado')
    const roles = user.roles.map(r => r.name.toLowerCase())

    // Si es vigilante, retorna solo las unidades asociadas
    if (roles.includes('vigilante')) {
      const unidades = await db
        .from('cf_usuario_unidad_residencial as uur')
        .join('am_unidad_residencial as ur', 'uur.unidad_residencial_id', 'ur.id')
        .select('ur.*')
        .where('uur.usuario_id', userId)
      return unidades
    }
    // Si es admin, retorna todas las unidades de la empresa
    if (roles.includes('administrador')) {
      // Buscar empresa del usuario (por la primera unidad asociada o por companyId si existe)
      const empresa = await db
        .from('cf_usuario_empresa')
        .where('usuario_id', userId)
        .first()
      if (!empresa) return []
      const unidades = await UnidadResidencial.query().where('empresa_id', empresa.empresa_id)
      return unidades
    }
    // Otros roles: retorna solo las unidades asociadas
    const unidades = await db
      .from('cf_usuario_unidad_residencial as uur')
      .join('am_unidad_residencial as ur', 'uur.unidad_residencial_id', 'ur.id')
      .select('ur.*')
      .where('uur.usuario_id', userId)
    return unidades
  }

  /**
   * Obtener la empresa asociada al usuario por su email
   */
  private async getCompanyByUserEmail(userEmail: string): Promise<Company> {
    const company = await Company.query().where('email', userEmail).first()
    
    if (!company) {
      throw new Error('No se encontró una empresa asociada a este usuario')
    }

    if (company.status !== 'activa') {
      throw new Error('La empresa no está activa')
    }

    return company
  }

  /**
   * Crear una nueva unidad residencial
   */
  public async create(userEmail: string, data: {
    documentTypeId: number
    document: string
    name: string
    address: string
    city: string
    adminPhone: string
    supportPhone: string
    contactEmail: string
    description?: string
  }) {
    // Obtener la empresa del usuario autenticado
    const company = await this.getCompanyByUserEmail(userEmail)

    // Verificar que no exista otra unidad con el mismo documento
    const existingUnit = await UnidadResidencial.query()
      .where('documento', data.document)
      .andWhere('tipo_documento_id', data.documentTypeId)
      .first()

    if (existingUnit) {
      throw new Error('Ya existe una unidad residencial con este número de documento')
    }

    // Crear la unidad residencial
    const unidadResidencial = new UnidadResidencial()
    unidadResidencial.documentTypeId = data.documentTypeId
    unidadResidencial.document = data.document
    unidadResidencial.name = data.name
    unidadResidencial.address = data.address
    unidadResidencial.city = data.city
    unidadResidencial.adminPhone = data.adminPhone
    unidadResidencial.supportPhone = data.supportPhone
    unidadResidencial.contactEmail = data.contactEmail
    unidadResidencial.description = data.description
    unidadResidencial.companyId = company.id

    await unidadResidencial.save()

    return await this.getById(unidadResidencial.id)
  }

  /**
   * Obtener una unidad residencial por ID (solo de la empresa del usuario)
   */
  public async getById(id: string, userEmail?: string): Promise<UnidadResidencial | null> {
    const query = UnidadResidencial
      .query()
      .where('id', id)
      .preload('documentType', (query) => {
        query.preload('baseType')
      })
      .preload('company')

    // Si se proporciona userEmail, verificar que la unidad pertenezca a la empresa del usuario
    if (userEmail) {
      const company = await this.getCompanyByUserEmail(userEmail)
      query.where('empresa_id', company.id)
    }

    return await query.first()
  }

  /**
   * Obtener todas las unidades residenciales de la empresa del usuario
   */
  public async getByCompany(userEmail: string, options: {
    page?: number
    limit?: number
    search?: string
  }) {
    const company = await this.getCompanyByUserEmail(userEmail)
    const { page = 1, limit = 10, search } = options

    const query = UnidadResidencial
      .query()
      .where('empresa_id', company.id)
      .preload('documentType', (query) => {
        query.preload('baseType')
      })
      .preload('company')

    if (search) {
      query.where((builder) => {
        builder
          .whereILike('nombre', `%${search}%`)
          .orWhereILike('documento', `%${search}%`)
          .orWhereILike('direccion', `%${search}%`)
          .orWhereILike('ciudad', `%${search}%`)
      })
    }

    return await query.paginate(page, limit)
  }

  /**
   * Obtener todas las unidades residenciales de la empresa del usuario (sin paginación)
   */
  public async getAllByCompany(userEmail: string, options?: {
    search?: string
  }) {
    const company = await this.getCompanyByUserEmail(userEmail)
    const { search } = options || {}

    const query = UnidadResidencial
      .query()
      .where('empresa_id', company.id)
      .preload('documentType', (query) => {
        query.preload('baseType')
      })
      .preload('company')

    if (search) {
      query.where((builder) => {
        builder
          .whereILike('nombre', `%${search}%`)
          .orWhereILike('documento', `%${search}%`)
          .orWhereILike('direccion', `%${search}%`)
          .orWhereILike('ciudad', `%${search}%`)
      })
    }

    return await query
  }

  /**
   * Actualizar una unidad residencial
   */
  public async update(id: string, userEmail: string, updateData: {
    documentTypeId?: number
    document?: string
    name?: string
    address?: string
    city?: string
    adminPhone?: string
    supportPhone?: string
    contactEmail?: string
    description?: string
  }) {
    const company = await this.getCompanyByUserEmail(userEmail)

    const unidadResidencial = await UnidadResidencial.query()
      .where('id', id)
      .andWhere('empresa_id', company.id)
      .first()

    if (!unidadResidencial) {
      throw new Error('Unidad residencial no encontrada o no pertenece a su empresa')
    }

    // Si se está actualizando el documento, verificar que no exista otro con el mismo
    if (updateData.document && updateData.documentTypeId) {
      const existingUnit = await UnidadResidencial.query()
        .where('documento', updateData.document)
        .andWhere('tipo_documento_id', updateData.documentTypeId)
        .andWhereNot('id', id)
        .first()

      if (existingUnit) {
        throw new Error('Ya existe otra unidad residencial con este número de documento')
      }
    }

    unidadResidencial.merge(updateData)
    await unidadResidencial.save()

    return await this.getById(id)
  }

  /**
   * Eliminar una unidad residencial
   */
  public async delete(id: string, userEmail: string) {
    const company = await this.getCompanyByUserEmail(userEmail)

    const unidadResidencial = await UnidadResidencial.query()
      .where('id', id)
      .andWhere('empresa_id', company.id)
      .first()

    if (!unidadResidencial) {
      throw new Error('Unidad residencial no encontrada o no pertenece a su empresa')
    }

    // Eliminar logo si existe
    if (unidadResidencial.logoUrl) {
      try {
        const fileName = unidadResidencial.logoUrl.split('/').pop()
        if (fileName) {
          const uploadsDir = join(app.makePath('public'), 'uploads', 'unidades')
          const filePath = join(uploadsDir, fileName)
          if (existsSync(filePath)) {
            await unlink(filePath)
          }
        }
      } catch (error) {
        console.warn('Error al eliminar logo de unidad residencial:', error)
      }
    }

    await unidadResidencial.delete()
    return { message: 'Unidad residencial eliminada exitosamente' }
  }

  /**
   * Subir y guardar logo de la unidad residencial
   */
  public async uploadLogo(id: string, userEmail: string, logoFile: MultipartFile) {
    const company = await this.getCompanyByUserEmail(userEmail)

    const unidadResidencial = await UnidadResidencial.query()
      .where('id', id)
      .andWhere('empresa_id', company.id)
      .first()

    if (!unidadResidencial) {
      throw new Error('Unidad residencial no encontrada o no pertenece a su empresa')
    }

    // Validar el archivo
    if (!logoFile.isValid) {
      throw new Error(`Archivo inválido: ${logoFile.errors.map(e => e.message).join(', ')}`)
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = join(app.makePath('public'), 'uploads', 'unidades')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Eliminar logo anterior si existe
    if (unidadResidencial.logoUrl) {
      try {
        const oldFileName = unidadResidencial.logoUrl.split('/').pop()
        if (oldFileName) {
          const oldFilePath = join(uploadsDir, oldFileName)
          if (existsSync(oldFilePath)) {
            await unlink(oldFilePath)
          }
        }
      } catch (error) {
        console.warn('Error al eliminar logo anterior:', error)
      }
    }

    // Generar nombre único para el archivo
    const fileExtension = logoFile.extname
    const fileName = `unidad_${id}_${cuid()}.${fileExtension}`
    
    // Mover el archivo a la ubicación final
    await logoFile.move(uploadsDir, {
      name: fileName
    })

    // Construir la URL del logo
    const logoUrl = `/uploads/unidades/${fileName}`

    // Actualizar la unidad con la nueva URL del logo
    unidadResidencial.logoUrl = logoUrl
    await unidadResidencial.save()

    return {
      logoUrl,
      unidadResidencial: await this.getById(id)
    }
  }
}
