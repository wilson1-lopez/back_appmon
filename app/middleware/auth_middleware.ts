import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import '../../types/auth.js'

export default class AuthMiddleware {
  private jwtSecret = env.get('JWT_SECRET')!

  async handle(ctx: HttpContext, next: NextFn) {
    try {
      const authHeader = ctx.request.header('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.response.unauthorized({ error: 'Token de autorización requerido' })
      }

      const token = authHeader.substring(7) // Remover "Bearer "
      
      const payload = jwt.verify(token, this.jwtSecret) as any
      
      if (!payload || !payload.sub) {
        return ctx.response.unauthorized({ error: 'Token inválido' })
      }

      // Agregar información del usuario al contexto
      ctx.auth = {
        user: {
          id: payload.sub,
          email: payload.email,
          username: payload.username,
          firstName: payload.firstName,
          lastName: payload.lastName,
          roles: payload.roles || [],
          permissions: payload.permissions || {}
        }
      }

      await next()
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return ctx.response.unauthorized({ error: 'Token expirado' })
      }
      if (error.name === 'JsonWebTokenError') {
        return ctx.response.unauthorized({ error: 'Token inválido' })
      }
      return ctx.response.internalServerError({ error: 'Error de autenticación' })
    }
  }
}
