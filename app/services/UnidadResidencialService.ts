import UnidadResidencial from '#models/UnidadResidencial'
import Company from '#models/Company'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { mkdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import db from '@adonisjs/lucid/services/db'
//import User from '#models/User'

export default class UnidadResidencialService {
  
  public async getUnidadesByUsuario(userId: string) {
    // Obtener todas las unidades residenciales asociadas al usuario, sin importar el rol
    const unidades = await db
      .from('cf_usuario_unidad_residencial as uur')
      .join('am_unidad_residencial as ur', 'uur.unidad_residencial_id', 'ur.id')
      .select('ur.*')
      .where('uur.usuario_id', userId)
      .andWhere('uur.estado', true)
    return unidades
  }

  /**
   * Obtener la empresa asociada al usuario por su email
   */
  /**
   * Obtener la empresa asociada a un usuario (por email de usuario, no de empresa)
   */
  private async getCompanyByUserEmail(userEmail: string): Promise<Company> {
    // Buscar el usuario global por email
    const user = await db.from('cf_usuarios').where('correo', userEmail).first()
    if (!user) {
      throw new Error('No se encontró un usuario con este correo')
    }

    // Buscar la relación usuario-empresa activa
    const usuarioEmpresa = await db
      .from('cf_usuario_empresa')
      .where('usuario_id', user.id)
      .andWhere('estado', true)
      .first()
    if (!usuarioEmpresa) {
      throw new Error('El usuario no está asociado a ninguna empresa activa')
    }

    // Buscar la empresa
    const company = await Company.query().where('id', usuarioEmpresa.empresa_id).first()
    if (!company) {
      throw new Error('No se encontró la empresa asociada al usuario')
    }
    if (company.status !== 'activo') {
      throw new Error('La empresa no está activa')
    }
    return company
  }

  /**
   * Crear una nueva unidad residencial
   */
  public async create(userEmail: string, data: {
    // Se aceptan ambos formatos de nombres (inglés y español)
    tipoDocumentoId?: number | string
    documento?: string
    nombre?: string
    direccion?: string
    ciudadId?: number | string
    telefonoAdministradora?: string
    telefonoSoporte?: string
    correoContacto?: string
    descripcion?: string
    // Inglés
    documentTypeId?: number | string
    document?: string
    name?: string
    address?: string
    city?: number | string
    adminPhone?: string
    supportPhone?: string
    contactEmail?: string
    description?: string
  }) {
    // ...validación se realiza en el validador, no aquí...

    // Normalizar los datos para aceptar ambos formatos
    const documentTypeId = data.tipoDocumentoId ?? data.documentTypeId
    const document = data.documento ?? data.document
    const name = data.nombre ?? data.name
    const address = data.direccion ?? data.address
    const city = data.ciudadId ?? data.city
    const adminPhone = data.telefonoAdministradora ?? data.adminPhone
    const supportPhone = data.telefonoSoporte ?? data.supportPhone
    const contactEmail = data.correoContacto ?? data.contactEmail
    const description = data.descripcion ?? data.description

    // Convertir a number si vienen como string
    const documentTypeIdNum = typeof documentTypeId === 'string' ? parseInt(documentTypeId) : documentTypeId
    const cityNum = typeof city === 'string' ? parseInt(city) : city

    // Validar que los campos requeridos no sean undefined o null
    if (
      document == null ||
      documentTypeIdNum == null ||
      name == null ||
      address == null ||
      cityNum == null ||
      adminPhone == null ||
      supportPhone == null ||
      contactEmail == null
    ) {
      throw new Error('Faltan campos obligatorios para crear la unidad residencial')
    }

    // Obtener la empresa del usuario autenticado
    const company = await this.getCompanyByUserEmail(userEmail)

    // Verificar que no exista otra unidad con el mismo documento
    const existingUnit = await UnidadResidencial.query()
      .where('documento', document)
      .andWhere('tipo_documento_id', documentTypeIdNum)
      .first()

    if (existingUnit) {
      throw new Error('Ya existe una unidad residencial con este número de documento')
    }

    // Crear la unidad residencial
    const unidadResidencial = new UnidadResidencial()
    unidadResidencial.documentTypeId = documentTypeIdNum
    unidadResidencial.document = document
    unidadResidencial.name = name
    unidadResidencial.address = address
    unidadResidencial.ciudadId = cityNum
    unidadResidencial.adminPhone = adminPhone
    unidadResidencial.supportPhone = supportPhone
    unidadResidencial.contactEmail = contactEmail
    unidadResidencial.description = description
    unidadResidencial.companyId = company.id

    await unidadResidencial.save()

    // Llamar al procedimiento almacenado para crear el schema privado de la unidad
    const schemaName = `unidad_${unidadResidencial.id}`
    await db.rawQuery('CALL cf_crear_schema_unidad(?)', [schemaName])

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
      .preload('city')

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
      .where('estado', true)
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
    ciudadId?: number 
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

    // Normalizar y convertir ciudadId
    let ciudadIdValue = updateData.ciudadId
    if (ciudadIdValue !== undefined && typeof ciudadIdValue === 'string') {
      ciudadIdValue = parseInt(ciudadIdValue)
    }
    const dataToUpdate: any = { ...updateData }
    if (ciudadIdValue !== undefined && !isNaN(ciudadIdValue)) {
      dataToUpdate.ciudadId = ciudadIdValue as number
    }
    if (dataToUpdate.ciudadId !== undefined && typeof dataToUpdate.ciudadId !== 'number') {
      delete dataToUpdate.ciudadId
    }

    unidadResidencial.merge(dataToUpdate)
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

    // Eliminado lógico: poner estado en false
    unidadResidencial.estado = false
    await unidadResidencial.save()
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
