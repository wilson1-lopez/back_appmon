import Company from '#models/Company'
import User from '#models/User'
import env from '#start/env'
import Hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
//import ActivationToken from '#models/ActivationToken'
import mail from '@adonisjs/mail/services/main'



export default class UserService {
    private jwtSecret = env.get('JWT_SECRET')!
  public async register(data: {
    firstName: string
    lastName?: string | null
    email: string
    username: string
    password: string
  }) {
    const user = new User()
    user.firstName = data.firstName
    user.lastName = data.lastName ?? null
    user.email = data.email
    user.username = data.username
    user.password = await Hash.make(data.password)
    user.isActive = true
    await user.save()
    return user
  }

public async registerCompanyAndUser(data: {
    countryId: number
    email: string
    password: string
    documentTypeId: number
    document: string
    name: string
  }) {
    // Validar si el correo ya está registrado
    const existingUser = await User.query().where('email', data.email).first()
    if (existingUser) {
      throw new Error('El correo ya está vinculado a una cuenta.')
    }

    // Validar si el documento ya está registrado en alguna empresa
    const existingCompany = await Company.query()
      .where('document', data.document)
      .andWhere('documentTypeId', data.documentTypeId) 
      .first()
    if (existingCompany) {
      throw new Error('El número de documento ya está vinculado a una empresa.')
    }

    return await db.transaction(async (trx) => {
      // 1. Crear usuario
      const user = new User()
      user.useTransaction(trx)
      user.email = data.email
      user.password = await Hash.make(data.password)
      user.firstName = data.name
      user.username = data.email
      user.isActive = false
      await user.save()

      // 2. Crear empresa
      const company = new Company()
      company.useTransaction(trx)
      company.countryId = data.countryId
      company.documentTypeId = data.documentTypeId
      company.document = data.document
      company.name = data.name
      company.status = 'pendiente de verificación'
      company.email = data.email
      company.address = ''
      company.phone = ''
      company.companyType = 'Administrador'
      await company.save()

      // 3. Asociar usuario al rol de administrador (ajusta el rol_id según corresponda)
      await trx.table('cf_usuario_rol').insert({
        usuario_id: user.id,
        rol_id: 1,
        asignado_en: DateTime.now().toSQL(),
        created_at: DateTime.now().toSQL(),
        updated_at: DateTime.now().toSQL(),
      })

      // 3. Crear esquema y asociar (solo inserta en cf_empresas)
      const schemaName = `empresa_${randomBytes(6).toString('hex')}`
     await trx.rawQuery('CALL public.cf_registrar_empresa(?, ?)', [
  company.id,
  schemaName,
])
      
    const activationPayload = {
      sub: user.id,
      email: user.email,
      type: 'activation',
    }
    const token = jwt.sign(activationPayload, this.jwtSecret, { expiresIn: '8h' })

      // 6. Enviar correo de activación
      const activationUrl = `http://localhost:4200/account-activation?token=${token}`
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

      return { user, company }
    })
  }

//vamos a obtener los usuarios y el tipo de rol de una empresa 
// Obtener la empresa asociada al usuario por su email
  public async getCompanyByUserEmail(userEmail: string) {
    const company = await Company.query().where('email', userEmail).first()
    if (!company) {
      throw new Error('No se encontró una empresa asociada a este usuario')
    }
    return company
  }

  // Obtener todos los usuarios de una empresa junto con sus roles
  public async getUsersWithRolesByCompanyId(companyId: string) {
    const users = await User.query()
      .whereIn('id', (builder) => {
        builder.select('usuario_id').from('cf_usuario_empresa').where('empresa_id', companyId)
      })
      .preload('roles', (roleQuery) => {
        roleQuery.where('estado', true)
      })
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      phone: user.phone,
      isActive: user.isActive,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description
      }))
    }))
  }

  // Crear un usuario para la empresa
  public async createUserForCompany(companyId: string, data: any, unidades: string[] = []) {
    // Validar que la empresa exista antes de la transacción
    const empresaExiste = await db.from('am_empresas').where('id', companyId).first()
    if (!empresaExiste) {
      throw new Error('La empresa especificada no existe')
    }
    return await db.transaction(async (trx) => {
      // Validar que el email no esté en uso en la empresa (usando la tabla pivote)
      const existing = await db
        .from('cf_usuarios as u')
        .join('cf_usuario_empresa as ue', 'u.id', 'ue.usuario_id')
        .where('ue.empresa_id', companyId)
        .andWhere('u.correo', data.email)
        .first()
      if (existing) {
        throw new Error('El correo ya está registrado en la empresa')
      }

      // Crear usuario
      const user = new User()
      user.useTransaction(trx)
      user.firstName = data.firstName
      user.lastName = data.lastName
      user.email = data.email
      user.username = data.username || data.email // Si no viene username, usa el correo
      user.phone = data.phone // Guardar teléfono
      user.password = await Hash.make(data.password)
      user.isActive = true
      await user.save()

      // Relacionar usuario con empresa en la tabla pivote
      await trx.table('cf_usuario_empresa').insert({
        usuario_id: user.id,
        empresa_id: companyId,
        created_at: DateTime.now().toSQL(),
      })

      // Asignar rol si se provee
      if (data.roleId) {
        await trx.table('cf_usuario_rol').insert({
          usuario_id: user.id,
          rol_id: data.roleId,
          asignado_en: DateTime.now().toSQL(),
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        })
      }

      // Asociar usuario a las unidades residenciales (tabla pivote)
      for (const unidadId of unidades) {
        await trx.table('cf_usuario_unidad_residencial').insert({
          usuario_id: user.id,
          unidad_residencial_id: unidadId,
          created_at: DateTime.now().toSQL(),
        })
      }

      // Enviar correo de bienvenida al usuario
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Bienvenido a AppMon')
          .html(`
            <div style="text-align: center;">
              <img src="https://jsgunttlrrdtnqmvrngh.supabase.co/storage/v1/object/public/site_assets/icons/1743045465653_AppMon_Icon_2.png" alt="AppMon Logo" style="width: 120px; margin-bottom: 24px;" />
              <h2>¡Bienvenido, ${user.firstName}!</h2>
              <p>Tu cuenta ha sido creada exitosamente.</p>
              <p>
                ${data.password
                  ? `Tus credenciales iniciales son:<br>
                    Usuario: <b>${user.username}</b><br>
                    Contraseña: <b>${data.password}</b>`
                  : 'Por favor, sigue las instrucciones para establecer tu contraseña.'}
              </p>
              <p>Si tienes dudas, contacta al administrador de tu empresa.</p>
            </div>
          `)
      })

      return user
    })
  }

  // Actualizar un usuario de la empresa (corrige búsqueda por tabla pivote)
  public async updateUserForCompany(companyId: string, userId: string, data: any, unidades: string[] = []) {
    return await db.transaction(async (trx) => {
      // Buscar usuario y verificar que pertenezca a la empresa usando la tabla pivote
      const usuarioEmpresa = await trx
        .from('cf_usuario_empresa')
        .where('empresa_id', companyId)
        .andWhere('usuario_id', userId)
        .first()
      if (!usuarioEmpresa) {
        throw new Error('Usuario no encontrado en la empresa')
      }
      // Buscar usuario
      const user = await User.find(userId)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      // Si se quiere cambiar el email, verificar que no exista en la empresa (excepto el propio)
      if (data.email && data.email !== user.email) {
        const existing = await trx
          .from('cf_usuarios as u')
          .join('cf_usuario_empresa as ue', 'u.id', 'ue.usuario_id')
          .where('ue.empresa_id', companyId)
          .andWhere('u.correo', data.email)
          .andWhereNot('u.id', user.id)
          .first()
        if (existing) {
          throw new Error('El correo ya está registrado en la empresa')
        }
      }

      // Actualizar campos básicos
      if (data.firstName !== undefined) user.firstName = data.firstName
      if (data.lastName !== undefined) user.lastName = data.lastName
      if (data.email !== undefined) user.email = data.email
      if (data.username !== undefined) user.username = data.username
      if (data.phone !== undefined) user.phone = data.phone
      if (data.isActive !== undefined) user.isActive = data.isActive
      // Actualizar contraseña si se envía
      if (data.password) user.password = await Hash.make(data.password)
      await user.useTransaction(trx).save()

      // Actualizar rol si se envía
      if (data.roleId) {
        await user.related('roles').sync([data.roleId])
      }

      // Actualizar unidades residenciales si se envía el arreglo
      if (Array.isArray(unidades)) {
        // Eliminar relaciones actuales
        await trx.from('cf_usuario_unidad_residencial').where('usuario_id', user.id).delete()
        // Insertar nuevas relaciones
        for (const unidadId of unidades) {
          await trx.table('cf_usuario_unidad_residencial').insert({
            usuario_id: user.id,
            unidad_residencial_id: unidadId,
            created_at: DateTime.now().toSQL(),
          })
        }
      }
      return user
    })
  }

  // Eliminar un usuario de la empresa
  public async deleteUserForCompany(companyId: string, userId: string) {
    const user = await User.query().where('empresa_id', companyId).andWhere('id', userId).first()
    if (!user) {
      throw new Error('Usuario no encontrado en la empresa')
    }
    await user.related('roles').detach()
    await user.delete()
  }

  // Obtener usuario por UUID con unidad residencial, rol y tipo de rol
  public async getUserDetailById(userId: string) {
    // Buscar usuario
    const user = await User.query()
      .where('id', userId)
      .preload('roles', (roleQuery) => {
        roleQuery.preload('businessType')
      })
      .first()
    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    // Buscar unidades residenciales asociadas (puede haber varias)
    const unidades = await db
      .from('cf_usuario_unidad_residencial as uur')
      .join('am_unidad_residencial as ur', 'uur.unidad_residencial_id', 'ur.id')
      .select('ur.*')
      .where('uur.usuario_id', userId)

    return {
      ...user.serialize(),
      unidadesResidenciales: unidades,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        businessType: role.businessType ? {
          id: role.businessType.id,
          name: role.businessType.name,
          code: role.businessType.code,
        } : null,
      })),
    }
  }

  
  
}