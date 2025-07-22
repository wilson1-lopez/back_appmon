import Company from '#models/Company'
import User from '#models/User'
import env from '#start/env'
import Hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
//import { randomBytes } from 'crypto'
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
      company.documentTypeId = data.documentTypeId
      company.document = data.document
      company.name = data.name
      company.status = 'inactivo'
      company.email = data.email
      company.address = ''
      company.phone = ''
      company.companyTypeId = 1 // O el id correspondiente al tipo de compañía por defecto
      company.countryId = data.countryId
      await company.save()

      // 3. Relacionar usuario con empresa (cf_usuario_empresa)
      const [usuarioEmpresaId] = await trx.table('cf_usuario_empresa').insert({
        usuario_id: user.id,
        empresa_id: company.id,
        created_at: DateTime.now().toSQL(),
      }).returning('id')

      // 4. Asignar rol de administrador en contexto empresa (cf_usuario_empresa_roles)
      await trx.table('cf_usuario_empresa_roles').insert({
        usuario_empresa_id: usuarioEmpresaId.id || usuarioEmpresaId, // depende del driver
        rol_id: 2, // Ajusta el rol_id según corresponda
        asignado_por: user.id, // El mismo usuario se autoasigna
        activo: true,
      })

      // 5. Generar token de activación
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
    // Traer usuarios relacionados por empresa y por unidad residencial de la empresa
    // 1. Usuarios por empresa (solo activos)
    const empresaRows = await db
      .from('cf_usuario_empresa as ue')
      .join('cf_usuarios as u', 'ue.usuario_id', 'u.id')
      .leftJoin('cf_usuario_empresa_roles as uer', 'ue.id', 'uer.usuario_empresa_id')
      .leftJoin('cf_roles as r', 'uer.rol_id', 'r.id')
      .select(
        'u.id as userId',
        'u.nombre as firstName',
        'u.apellido as lastName',
        'u.correo as email',
        'u.usuario as username',
        'u.telefono as phone',
        'u.estado as isActive',
        'r.id as roleId',
        'r.nombre as roleName',
        'r.descripcion as roleDescription',
        db.raw('NULL as unidadResidencialId')
      )
      .where('ue.empresa_id', companyId)
      .andWhere('u.estado', true)
      .orderBy('u.nombre', 'asc');

    // 2. Usuarios por unidad residencial de la empresa (solo activos)
    // Primero obtener las unidades residenciales de la empresa
    const unidades = await db.from('am_unidad_residencial').select('id').where('empresa_id', companyId);
    const unidadIds = unidades.map((u: any) => u.id);
    let unidadRows: any[] = [];
    if (unidadIds.length > 0) {
      unidadRows = await db
        .from('cf_usuario_unidad_residencial as uur')
        .join('cf_usuarios as u', 'uur.usuario_id', 'u.id')
        .leftJoin('cf_usuario_unidad_roles as uurr', 'uur.id', 'uurr.usuario_unidad_id')
        .leftJoin('cf_roles as r', 'uurr.rol_id', 'r.id')
        .select(
          'u.id as userId',
          'u.nombre as firstName',
          'u.apellido as lastName',
          'u.correo as email',
          'u.usuario as username',
          'u.telefono as phone',
          'u.estado as isActive',
          'r.id as roleId',
          'r.nombre as roleName',
          'r.descripcion as roleDescription',
          'uur.unidad_residencial_id as unidadResidencialId'
        )
        .whereIn('uur.unidad_residencial_id', unidadIds)
        .andWhere('u.estado', true)
        .orderBy('u.nombre', 'asc');
    }

    // Unir ambos resultados y agrupar roles por usuario
    const allRows = [...empresaRows, ...unidadRows];
    const usersMap: Record<string, any> = {};
    for (const row of allRows) {
      if (!usersMap[row.userId]) {
        usersMap[row.userId] = {
          id: row.userId,
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          username: row.username,
          phone: row.phone,
          isActive: row.isActive,
          roles: [],
          unidadesResidenciales: [],
        };
      }
      if (row.roleId) {
        usersMap[row.userId].roles.push({
          id: row.roleId,
          name: row.roleName,
          description: row.roleDescription,
        });
      }
      if (row.unidadResidencialId && !usersMap[row.userId].unidadesResidenciales.includes(row.unidadResidencialId)) {
        usersMap[row.userId].unidadesResidenciales.push(row.unidadResidencialId);
      }
    }
    return Object.values(usersMap);
  }

  // Crear un usuario para la empresa
  public async createUserForCompany(companyId: string, data: any, unidades: string[] = []) {
    // Permitir que los roles vengan como string o number
    // Normalizar y validar roles (acepta number o string, y maneja 0 correctamente)
    let empresaRoleId: number | null = null;
    let unidadRoleId: number | null = null;
    // Normalización robusta
    if (data.empresaRoleId !== undefined && data.empresaRoleId !== null && String(data.empresaRoleId).toString().trim() !== '' && !isNaN(Number(data.empresaRoleId)) && Number(data.empresaRoleId) > 0) {
      empresaRoleId = Number(data.empresaRoleId);
    }
    if (data.unidadRoleId !== undefined && data.unidadRoleId !== null && String(data.unidadRoleId).toString().trim() !== '' && !isNaN(Number(data.unidadRoleId)) && Number(data.unidadRoleId) > 0) {
      unidadRoleId = Number(data.unidadRoleId);
    }
    // Debug: log the normalized values
    console.log('[DEBUG] empresaRoleId:', empresaRoleId, 'unidadRoleId:', unidadRoleId, 'data:', data);
    const hasEmpresaRole = typeof empresaRoleId === 'number' && empresaRoleId > 0;
    const hasUnidadRole = typeof unidadRoleId === 'number' && unidadRoleId > 0;
    if (!hasEmpresaRole && !hasUnidadRole) {
      throw new Error('Debes especificar un rol de empresa o de unidad residencial (empresaRoleId o unidadRoleId > 0)')
    }
    if (hasEmpresaRole && hasUnidadRole) {
      throw new Error('No puedes asignar ambos roles a la vez (empresaRoleId y unidadRoleId)')
    }


    // Determinar el id del usuario autenticado para asignado_por
    // Si el controlador lo envía como data.asignadoPor, úsalo; si no, usa el id del usuario creado
    const asignadoPor = data.asignadoPor || data.asignado_por || null;

    return await db.transaction(async (trx) => {
      // Crear usuario
      const user = new User()
      user.useTransaction(trx)
      user.firstName = data.firstName
      user.lastName = data.lastName
      user.email = data.email
      user.username = data.username || data.email
      user.phone = data.phone
      user.password = await Hash.make(data.password)
      user.isActive = true
      const userSaved = await user.save()
      if (!userSaved) {
        throw new Error('No se pudo crear el usuario')
      }

      // Si es usuario de empresa
      if (hasEmpresaRole && empresaRoleId !== null) {
        // Validar existencia de empresa
        const empresaExiste = await trx.from('am_empresas').where('id', companyId).first()
        if (!empresaExiste) {
          throw new Error('La empresa especificada no existe')
        }
        // Validar que el rol sea de tipo empresa
        const rolEmpresa = await trx.from('cf_roles').where('id', empresaRoleId).first()
        if (!rolEmpresa) {
          throw new Error('El rol de empresa especificado no existe')
        }
        if (rolEmpresa.tipo_negocio_id !== 1) {
          throw new Error('El rol asignado no corresponde a tipo empresa')
        }
        // Validar correo único en la empresa
        const existing = await trx
          .from('cf_usuarios as u')
          .join('cf_usuario_empresa as ue', 'u.id', 'ue.usuario_id')
          .where('ue.empresa_id', companyId)
          .andWhere('u.correo', data.email)
          .first()
        if (existing) {
          throw new Error('El correo ya está registrado en la empresa')
        }
        // Insertar en cf_usuario_empresa
        const usuarioEmpresaArr = await trx.table('cf_usuario_empresa').insert({
          usuario_id: user.id,
          empresa_id: companyId,
          created_at: DateTime.now().toSQL(),
        }).returning('id')
        if (!usuarioEmpresaArr || usuarioEmpresaArr.length === 0) {
          throw new Error('No se pudo crear la relación usuario-empresa')
        }
        const usuarioEmpresa = usuarioEmpresaArr[0]
        const usuarioEmpresaId = usuarioEmpresa.id || usuarioEmpresa
        // Insertar en cf_usuario_empresa_roles
        const empresaRolArr = await trx.table('cf_usuario_empresa_roles').insert({
          usuario_empresa_id: usuarioEmpresaId,
          rol_id: empresaRoleId,
          asignado_por: asignadoPor || user.id,
          activo: true,
        }).returning('usuario_empresa_id')
        if (!empresaRolArr || empresaRolArr.length === 0) {
          throw new Error('No se pudo asignar el rol de empresa')
        }

        // Asociar unidades residenciales si se reciben (solo para rol de empresa)
        const unidadesArray = data.unidades && Array.isArray(data.unidades) && data.unidades.length > 0 ? data.unidades : unidades;
        if (Array.isArray(unidadesArray) && unidadesArray.length > 0) {
          for (const unidadId of unidadesArray) {
            await trx.table('cf_usuario_unidad_residencial').insert({
              usuario_id: user.id,
              unidad_residencial_id: unidadId,
              created_at: DateTime.now().toSQL(),
            });
          }
        }
      }

      // Si es usuario de unidad residencial
      if (hasUnidadRole && unidadRoleId !== null) {
        // Validar tipo de negocio del rol de unidad
        const rolUnidad = await trx.from('cf_roles').where('id', unidadRoleId).first()
        if (!rolUnidad) {
          throw new Error('El rol de unidad especificado no existe')
        }
        if (rolUnidad.tipo_negocio_id !== 2) {
          throw new Error('El rol asignado no corresponde a tipo unidad residencial')
        }
        // Validar que venga una sola unidad
        const unidadesArray = data.unidades && Array.isArray(data.unidades) && data.unidades.length > 0 ? data.unidades : unidades
        if (!unidadesArray || unidadesArray.length !== 1) {
          throw new Error('Un usuario de unidad residencial debe estar asociado a una sola unidad.')
        }
        // Insertar en cf_usuario_unidad_residencial
        const usuarioUnidadArr = await trx.table('cf_usuario_unidad_residencial').insert({
          usuario_id: user.id,
          unidad_residencial_id: unidadesArray[0],
          created_at: DateTime.now().toSQL(),
        }).returning('id')
        if (!usuarioUnidadArr || usuarioUnidadArr.length === 0) {
          throw new Error('No se pudo crear la relación usuario-unidad residencial')
        }
        const usuarioUnidad = usuarioUnidadArr[0]
        const usuarioUnidadId = usuarioUnidad.id || usuarioUnidad
        // Insertar en cf_usuario_unidad_roles
        const unidadRolArr = await trx.table('cf_usuario_unidad_roles').insert({
          usuario_unidad_id: usuarioUnidadId,
          rol_id: unidadRoleId,
          asignado_por: asignadoPor || user.id,
          activo: true,
        }).returning('usuario_unidad_id')
        if (!unidadRolArr || unidadRolArr.length === 0) {
          throw new Error('No se pudo asignar el rol de unidad residencial')
        }
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
    // Debug log para ver los valores recibidos
    console.log('[DEBUG][updateUserForCompany] empresaRoleId:', data.empresaRoleId, 'unidadRoleId:', data.unidadRoleId, 'data:', data);
    // Normalizar y validar roles (acepta number o string, y maneja 0 correctamente)
    let empresaRoleId: number | null = null;
    let unidadRoleId: number | null = null;
    if (data.empresaRoleId !== undefined && data.empresaRoleId !== null && String(data.empresaRoleId).toString().trim() !== '' && !isNaN(Number(data.empresaRoleId)) && Number(data.empresaRoleId) > 0) {
      empresaRoleId = Number(data.empresaRoleId);
    }
    if (data.unidadRoleId !== undefined && data.unidadRoleId !== null && String(data.unidadRoleId).toString().trim() !== '' && !isNaN(Number(data.unidadRoleId)) && Number(data.unidadRoleId) > 0) {
      unidadRoleId = Number(data.unidadRoleId);
    }
    const hasEmpresaRole = typeof empresaRoleId === 'number' && empresaRoleId > 0;
    const hasUnidadRole = typeof unidadRoleId === 'number' && unidadRoleId > 0;
    if (!hasEmpresaRole && !hasUnidadRole) {
      throw new Error('Debes especificar un rol de empresa o de unidad residencial (empresaRoleId o unidadRoleId > 0)')
    }
    if (hasEmpresaRole && hasUnidadRole) {
      throw new Error('No puedes asignar ambos roles a la vez (empresaRoleId y unidadRoleId)')
    }

    // Determinar el id del usuario autenticado para asignado_por
    // Siempre usar el id del usuario autenticado para asignado_por (no permitir fallback)
    const asignadoPor = data.asignadoPor;

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

      // Si es usuario de empresa
      if (hasEmpresaRole && empresaRoleId !== null) {
        // Validar existencia de empresa
        const empresaExiste = await trx.from('am_empresas').where('id', companyId).first()
        if (!empresaExiste) {
          throw new Error('La empresa especificada no existe')
        }
        // Validar que el rol sea de tipo empresa
        const rolEmpresa = await trx.from('cf_roles').where('id', empresaRoleId).first()
        if (!rolEmpresa) {
          throw new Error('El rol de empresa especificado no existe')
        }
        if (rolEmpresa.tipo_negocio_id !== 1) {
          throw new Error('El rol asignado no corresponde a tipo empresa')
        }
        // Actualizar rol en cf_usuario_empresa_roles
        // Eliminar roles actuales
        await trx.from('cf_usuario_empresa_roles').where('usuario_empresa_id', usuarioEmpresa.id || usuarioEmpresa).delete()
        // Insertar nuevo rol
        await trx.table('cf_usuario_empresa_roles').insert({
          usuario_empresa_id: usuarioEmpresa.id || usuarioEmpresa,
          rol_id: empresaRoleId,
          asignado_por: asignadoPor || user.id,
          activo: true,
        })

        // Asociar unidades residenciales si se reciben (solo para rol de empresa)
        const unidadesArray = data.unidades && Array.isArray(data.unidades) && data.unidades.length > 0 ? data.unidades : unidades;
        if (Array.isArray(unidadesArray)) {
          // Eliminar relaciones actuales
          await trx.from('cf_usuario_unidad_residencial').where('usuario_id', user.id).delete()
          // Insertar nuevas relaciones
          for (const unidadId of unidadesArray) {
            await trx.table('cf_usuario_unidad_residencial').insert({
              usuario_id: user.id,
              unidad_residencial_id: unidadId,
              created_at: DateTime.now().toSQL(),
            })
          }
        }
      }

      // Si es usuario de unidad residencial
      if (hasUnidadRole && unidadRoleId !== null) {
        // Validar tipo de negocio del rol de unidad
        const rolUnidad = await trx.from('cf_roles').where('id', unidadRoleId).first()
        if (!rolUnidad) {
          throw new Error('El rol de unidad especificado no existe')
        }
        if (rolUnidad.tipo_negocio_id !== 2) {
          throw new Error('El rol asignado no corresponde a tipo unidad residencial')
        }
        // Validar que venga una sola unidad
        const unidadesArray = data.unidades && Array.isArray(data.unidades) && data.unidades.length > 0 ? data.unidades : unidades
        if (!unidadesArray || unidadesArray.length !== 1) {
          throw new Error('Un usuario de unidad residencial debe estar asociado a una sola unidad.')
        }
        // Eliminar relaciones actuales de usuario-unidad y roles
        await trx.from('cf_usuario_unidad_residencial').where('usuario_id', user.id).delete()
        // Insertar nueva relación usuario-unidad
        const usuarioUnidadArr = await trx.table('cf_usuario_unidad_residencial').insert({
          usuario_id: user.id,
          unidad_residencial_id: unidadesArray[0],
          created_at: DateTime.now().toSQL(),
        }).returning('id')
        const usuarioUnidad = usuarioUnidadArr[0]
        const usuarioUnidadId = usuarioUnidad.id || usuarioUnidad
        // Eliminar roles actuales de usuario-unidad
        await trx.from('cf_usuario_unidad_roles').where('usuario_unidad_id', usuarioUnidadId).delete()
        // Insertar nuevo rol de unidad
        await trx.table('cf_usuario_unidad_roles').insert({
          usuario_unidad_id: usuarioUnidadId,
          rol_id: unidadRoleId,
          asignado_por: asignadoPor || user.id,
          activo: true,
        })
        // Eliminar roles de empresa si existen
        await trx.from('cf_usuario_empresa_roles').where('usuario_empresa_id', usuarioEmpresa.id || usuarioEmpresa).delete()
      }
      return user
    })
  }

  // Eliminar un usuario de la empresa
  public async deleteUserForCompany(userId: string) {
    // Buscar el usuario en cf_usuarios por id y desactivar
    const user = await User.find(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.isActive = false;
    await user.save();
    return { message: 'Usuario eliminado correctamente (eliminación lógica).' };
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
      .select([
        'ur.id',
        'ur.nombre',
        'ur.documento',
        'ur.tipo_documento_id',
        'ur.empresa_id',
        'ur.updated_at',
        'uur.id as usuarioUnidadId'
      ])
      .where('uur.usuario_id', userId)

    // Buscar roles por contexto empresa
    const empresaRoles = await db
      .from('cf_usuario_empresa as ue')
      .leftJoin('cf_usuario_empresa_roles as uer', 'ue.id', 'uer.usuario_empresa_id')
      .leftJoin('cf_roles as r', 'uer.rol_id', 'r.id')
      .select('r.id as roleId', 'r.nombre as roleName', 'ue.empresa_id')
      .where('ue.usuario_id', userId)

    // Buscar roles por contexto unidad residencial
    const unidadRoles = await db
      .from('cf_usuario_unidad_residencial as uur')
      .leftJoin('cf_usuario_unidad_roles as uurr', 'uur.id', 'uurr.usuario_unidad_id')
      .leftJoin('cf_roles as r', 'uurr.rol_id', 'r.id')
      .select('r.id as roleId', 'r.nombre as roleName', 'uur.unidad_residencial_id')
      .where('uur.usuario_id', userId)

    // Unir roles de empresa y unidad en un solo arreglo
    const roles = [
      ...empresaRoles.filter(r => r.roleId).map(r => ({
        id: r.roleId,
        name: r.roleName,
        context: 'empresa',
        empresaId: r.empresa_id
      })),
      ...unidadRoles.filter(r => r.roleId).map(r => ({
        id: r.roleId,
        name: r.roleName,
        context: 'unidad',
        unidadResidencialId: r.unidad_residencial_id
      }))
    ];

    return {
      ...user.serialize(),
      unidadesResidenciales: unidades,
      roles,
    }
  }

  
  
}