import User from '#models/User'
import Company from '#models/Company'
import env from '#start/env'
import jwt from 'jsonwebtoken'
import mail from '@adonisjs/mail/services/main'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { mkdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'



export default class CompanyService {
  private jwtSecret = env.get('JWT_SECRET')!

public async activateCompanyAccount(token: string) {
  try {
    // 1. Verificar y decodificar el token
    const payload = jwt.verify(token, this.jwtSecret);

    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('sub' in payload) ||
      !('type' in payload)
    ) {
      throw new Error('Token inválido para activación');
    }

    const sub = (payload as any).sub;
    const type = (payload as any).type;

    if (type !== 'activation') {
      throw new Error('Token inválido para activación');
    }

    // 2. Buscar usuario
    const user = await User.find(sub);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 3. Buscar empresa asociada (por email)
    const company = await Company.query().where('email', user.email).first();
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    // 4. Activar usuario y empresa si no están activos
    let updated = false;
    if (!user.isActive) {
      user.isActive = true;
      await user.save();
      updated = true;
    }
    if (company.status !== 'activa') {
      company.status = 'activa';
      await company.save();
      updated = true;
    }

    if (!updated) {
      return { status: 'already_active', message: 'La cuenta ya está activada' };
    }

    return { status: 'success', message: 'Cuenta activada exitosamente' };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
}



public async resendActivationByToken(token: string) {
  let payload: any
  try {
    payload = jwt.verify(token, this.jwtSecret)
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      payload = jwt.decode(token)
      if (
        typeof payload !== 'object' ||
        payload === null ||
        !('sub' in payload) ||
        !('type' in payload)
      ) {
        throw new Error('Token inválido para reenviar activación')
      }
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido')
    } else {
      throw error
    }
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('sub' in payload) ||
    !('type' in payload)
  ) {
    throw new Error('Token inválido para reenviar activación')
  }

  const sub = payload.sub
  const type = payload.type

  if (type !== 'activation') {
    throw new Error('Token inválido para reenviar activación')
  }

  // 2. Buscar usuario
  const user = await User.find(sub)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  // 3. Verificar si ya está activo
   if (user.isActive) {
    return { status: 'already', message: 'La cuenta ya está activada' }
  }

  // 4. Buscar empresa asociada
  const company = await Company.query().where('email', user.email).first()
  if (!company) {
    throw new Error('Empresa no encontrada')
  }

  // 5. Generar nuevo token de activación
  const newToken = jwt.sign(
    { sub: user.id, type: 'activation' },
    this.jwtSecret,
    { expiresIn: '8h' }
  )

  // 6. Enviar correo de activación
  const activationUrl = `http://localhost:4200/account-activation?token=${newToken}`
  await mail.send((message) => {
  message
    .to(user.email)
    .subject('Activación de cuenta AppMon')
    .html(`
      <div style="text-align: center;">
        <img src="https://jsgunttlrrdtnqmvrngh.supabase.co/storage/v1/object/public/site_assets/icons/1743045465653_AppMon_Icon_2.png" alt="AppMon Logo" style="width: 120px; margin-bottom: 24px;" />
        <h2>¡Bienvenido a la plataforma!</h2>
        <p>Para activar tu cuenta y la empresa <b>${company.name}</b>, haz clic en el siguiente botón:</p>
        <p>
          <a href="${activationUrl}" style="
            display: inline-block;
            padding: 12px 32px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
          ">Activar cuenta</a>
        </p>
        <p>Este enlace es válido por 8 horas.</p>
      </div>
    `)
})

  return { status: 'resent', message: 'Correo de activación reenviado' }
}


  /**
   * Obtener información completa de una empresa por ID
   */
  public async getCompanyById(companyId: string) {
    const company = await Company
      .query()
      .where('id', companyId)
      .preload('documentType', (query) => {
        query.preload('baseType')
      })
      .preload('companyType')
      .preload('country')
      .preload('department')
      .preload('city')
      .first()

    return company
  }

  /**
   * Obtener información completa de una empresa por email
   */
  public async getCompanyByEmail(email: string) {
    const company = await Company
      .query()
      .where('email', email)
      .preload('documentType', (query) => {
        query.preload('baseType')
      })
      .preload('companyType')
      .preload('country')
      .preload('department')
      .preload('city')
      .first()

    return company
  }

  /**
   * Obtener lista de empresas con paginación y filtros
   */
  public async getCompanies(options: {
    page?: number
    limit?: number
    status?: string
  }) {
    const { page = 1, limit = 10, status } = options
    
    const query = Company
      .query()
      .preload('documentType', (query) => {
        query.preload('baseType')
      })
      .preload('companyType')
      .preload('country')
      .preload('department')
      .preload('city')

    if (status) {
      query.where('status', status)
    }

    const companies = await query.paginate(page, limit)
    return companies
  }

  /**
   * Actualizar información de una empresa
   */
  public async updateCompany(companyId: string, updateData: any) {
    const company = await Company.find(companyId)
    
    if (!company) {
      throw new Error('Empresa no encontrada')
    }

    company.merge(updateData)
    await company.save()

    // Retornar la empresa actualizada con sus relaciones
    return await this.getCompanyById(companyId)
  }

  /**
   * Subir y guardar logo de la empresa
   */
  public async uploadLogo(companyId: string, logoFile: MultipartFile) {
    // Verificar que la empresa existe
    const company = await Company.find(companyId)
    if (!company) {
      throw new Error('Empresa no encontrada')
    }

    // Validar el archivo
    if (!logoFile.isValid) {
      throw new Error(`Archivo inválido: ${logoFile.errors.map(e => e.message).join(', ')}`)
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = join(app.makePath('public'), 'uploads', 'logos')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Eliminar logo anterior si existe
    if (company.logoUrl) {
      try {
        // Extraer el nombre del archivo de la URL
        const oldFileName = company.logoUrl.split('/').pop()
        if (oldFileName) {
          const oldFilePath = join(uploadsDir, oldFileName)
          if (existsSync(oldFilePath)) {
            await unlink(oldFilePath)
          }
        }
      } catch (error) {
        // Log del error pero continúa con el proceso de subida
        console.warn('Error al eliminar logo anterior:', error)
      }
    }

    // Generar nombre único para el archivo
    const fileExtension = logoFile.extname
    const fileName = `${companyId}_${cuid()}.${fileExtension}`
    
    // Mover el archivo a la ubicación final
    await logoFile.move(uploadsDir, {
      name: fileName
    })

    // Construir la URL del logo
    const logoUrl = `/uploads/logos/${fileName}`

    // Actualizar la empresa con la nueva URL del logo
    const updatedCompany = await this.updateCompany(companyId, { logoUrl })

    return {
      logoUrl,
      company: updatedCompany
    }
  }

}