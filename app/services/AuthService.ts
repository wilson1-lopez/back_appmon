import User from '#models/User'
import env from '#start/env'
import Hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import mail from '@adonisjs/mail/services/main'
import admin from 'firebase-admin'
import Company from '#models/Company'

// Inicializa Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), 
  });
}

export default class AuthService {
    private jwtSecret = env.get('JWT_SECRET')!

    /**
     * Helper para obtener usuario con roles y permisos
     */
    private async getUserWithRolesAndPermissions(identifier: string) {
        const user = await User.query()
            .where('email', identifier)
            .orWhere('username', identifier)
            .preload('roles', (roleQuery) => {
                roleQuery
                    .where('estado', true) // Solo roles activos
                    .preload('permissions', (permissionQuery) => {
                        permissionQuery.preload('feature')
                    })
            })
            .first()

        return user
    }

    /**
     * Generar payload JWT con roles y permisos
     */
    private generateJWTPayload(user: any) {
        // Extraer roles
        const roles = user.roles.map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description
        }))

        // Extraer permisos agrupados por funcionalidad
        const permissions: any = {}
        user.roles.forEach((role: any) => {
            role.permissions.forEach((permission: any) => {
                const featureName = permission.feature.name
                if (!permissions[featureName]) {
                    permissions[featureName] = {
                        featureId: permission.feature.id,
                        canView: false,
                        canCreate: false,
                        canEdit: false,
                        canDelete: false
                    }
                }
                
                // Combinar permisos (OR lógico - si cualquier rol permite algo, el usuario puede hacerlo)
                permissions[featureName].canView = permissions[featureName].canView || permission.canView
                permissions[featureName].canCreate = permissions[featureName].canCreate || permission.canCreate
                permissions[featureName].canEdit = permissions[featureName].canEdit || permission.canEdit
                permissions[featureName].canDelete = permissions[featureName].canDelete || permission.canDelete
            })
        })

        return {
            sub: user.id,
            email: user.email,
            username: user.firstName, 
            displayName: `${user.firstName} ${user.lastName || ''}`.trim(), 
            firstName: user.firstName,
            lastName: user.lastName,
            roles: roles,
            permissions: permissions
        }
    }   
    
    public async login(identifier: string, password: string) {
        const user = await this.getUserWithRolesAndPermissions(identifier)

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const passwordVerified = await Hash.verify(user.password, password)
        if (!passwordVerified) {
            return { status: 'invalid_password', message: 'Credenciales inválidas' }
        }

        if (!user.isActive) {
            return { status: 'inactive', message: 'La cuenta aún no está activada. Por favor, revise su correo para activarla.' }
        }

        // Buscar la empresa asociada al usuario por email
        const company = await Company.query().where('email', user.email).first()
        let profileStatus: 'complete' | 'incomplete' | undefined = undefined
        if (company) {
            profileStatus = this.isCompanyProfileComplete(company) ? 'complete' : 'incomplete'
        }

        // Generar token JWT con roles y permisos
        const payload = this.generateJWTPayload(user)
        const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' })

        return { 
            status: 'success', 
            message: 'Login exitoso', 
            token,
            ...(profileStatus !== undefined ? { profileStatus } : {})
        }
    }

    // Solicitar recuperación de contraseña
    public async requestPasswordReset(email: string) {
        const user = await User.query().where('email', email).first()
        if (!user) {
            // Por seguridad, no revelar si el usuario existe o no
            return { status: 'ok', message: 'Si el correo existe, se enviará un enlace de recuperación.' }
        }

        const token = jwt.sign(
            { sub: user.id, type: 'password_reset' },
            this.jwtSecret,
            { expiresIn: '1h' }
        )

        const resetUrl = `http://localhost:4200/reset-password?token=${token}`

        await mail.send((message) => {
            message
                .to(user.email)
                .subject('Recuperación de contraseña AppMon')
                .html(`
                    <div style="text-align: center;">
                        <img src="https://jsgunttlrrdtnqmvrngh.supabase.co/storage/v1/object/public/site_assets/icons/1743045465653_AppMon_Icon_2.png" alt="AppMon Logo" style="width: 120px; margin-bottom: 24px;" />
                        <h2>Recuperación de contraseña</h2>
                        <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
                        <p>
                            <a href="${resetUrl}" style="
                                display: inline-block;
                                padding: 12px 32px;
                                background-color: #007bff;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 6px;
                                font-size: 16px;
                                font-weight: bold;
                            ">Restablecer contraseña</a>
                        </p>
                        <p>Este enlace es válido por 1 hora.</p>
                    </div>
                `)
        })

        return { status: 'ok', message: 'Revisa tu correo para continuar' }
    }

    // Restablecer contraseña usando el token
    public async resetPassword(token: string, newPassword: string) {
        let payload: any
        try {
            payload = jwt.verify(token, this.jwtSecret)
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Este enlace ha expirado, solicita uno nuevo')
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Token inválido')
            }
            throw error
        }

        if (
            typeof payload !== 'object' ||
            payload === null ||
            !('sub' in payload) ||
            !('type' in payload) ||
            payload.type !== 'password_reset'
        ) {
            throw new Error('Token inválido para restablecer contraseña')
        }

        const user = await User.find(payload.sub)
        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        user.password = await Hash.make(newPassword)
        await user.save()

        return { status: 'success', message: 'Tu contraseña ha sido actualizada, ahora puedes iniciar sesión' }
    }   
    
    public async loginWithGoogle(idToken: string) {
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (err) {
            console.error('Error al verificar idToken de Firebase:', err);
            throw new Error('Token de Google inválido');
        }

        const email = decodedToken.email;
        if (!email) {
            throw new Error('No se pudo obtener información del usuario de Google');
        }

        // Busca el usuario por email con roles y permisos
        const user = await this.getUserWithRolesAndPermissions(email);
        if (!user) {
            throw new Error('Usuario no registrado');
           
        }

        if (!user.isActive) {
            return { status: 'inactive', message: 'La cuenta aún no está activada. Por favor, revise su correo para activarla.' }
        }

        // Buscar la empresa asociada al usuario por email
        const company = await Company.query().where('email', user.email).first()
        let profileStatus = 'incomplete'
        if (company && await this.isCompanyProfileComplete(company)) {
            profileStatus = 'complete'
        }

        // Genera el JWT de tu app con roles y permisos
        const payload = this.generateJWTPayload(user)
        const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' })

        return { 
            status: 'success', 
            message: 'Login exitoso', 
            token,
            profileStatus
        }
    }

    /**
     * Obtener información completa del usuario actual (desde JWT o por ID)
     */
    public async getCurrentUser(userId: string) {
        const user = await User.query()
            .where('id', userId)
            .preload('roles', (roleQuery) => {
                roleQuery
                    .where('estado', true)
                    .preload('permissions', (permissionQuery) => {
                        permissionQuery.preload('feature')
                    })
            })
            .first()

        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        const payload = this.generateJWTPayload(user)
        
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.firstName,
            displayName: `${user.firstName} ${user.lastName || ''}`.trim(), 
            roles: payload.roles,
            permissions: payload.permissions,
           // companyId: user.companyId // <-- Agregado para exponer empresa_id
        }
    }

    /**
     * Refrescar token con roles actualizados
     */
    public async refreshToken(userId: string) {
        const user = await this.getUserWithRolesAndPermissions(userId)
        
        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        if (!user.isActive) {
            throw new Error('Usuario inactivo')
        }        const payload = this.generateJWTPayload(user)
        const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' })

        return {
            status: 'success',
            message: 'Token refrescado exitosamente',
            token
        }
    }

    /**
     * Verifica si el perfil de la empresa está completo
     */
    private isCompanyProfileComplete(company: any): boolean {
        const requiredFields = [
            'documentTypeId',
            'document',
            'name',
            'address',
            'phone',
            'email',
            'companyTypeId',
            'countryId',
            'stateId',
            'cityId',
        ];
        return requiredFields.every((field) => !!company[field]);
    }

}
