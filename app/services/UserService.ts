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
      company.companyTypeId = 1
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
}