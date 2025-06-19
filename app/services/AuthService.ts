import User from '#models/User'
import env from '#start/env'
import Hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import mail from '@adonisjs/mail/services/main'

export default class AuthService {
    private jwtSecret = env.get('JWT_SECRET')!

    public async login(identifier: string, password: string) {
        const user = await User.query()
            .where('email', identifier)
            .orWhere('username', identifier)
            .first()

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

        // Generar token JWT
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        }
        const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' })

        return { status: 'success', message: 'Login exitoso', token }
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

}
