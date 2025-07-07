import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/UserService'
import AuthService from '#services/AuthService'
import { RegisterCompanyValidator } from '#validators/RegisterCompanyValidator'



export default class UserController {
  private userService = new UserService()
  private authService = new AuthService()

  /**
   * Registrar una nueva empresa y usuario
   */
  public async registerCompany({ request, response }: HttpContext) {
    const data = await request.validate({ schema: RegisterCompanyValidator })
    try {
      const result = await this.userService.registerCompanyAndUser(data)
      return response.created({ message: 'Registro exitoso. Revise su correo para activar la cuenta.', ...result })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener información del usuario actual
   */
  public async me({ auth, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const user = await this.authService.getCurrentUser(auth.user.id)
      
      return response.ok({ 
        message: 'Información del usuario obtenida exitosamente',
        data: user 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Refrescar token del usuario
   */
  public async refreshToken({ auth, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const result = await this.authService.refreshToken(auth.user.id)
      
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener usuarios y sus roles de la empresa autenticada
   */
  public async getUsersByCompany({ auth, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }
      // Obtener el usuario autenticado
      const currentUser = await this.authService.getCurrentUser(auth.user.id)
      // Buscar la empresa por el email del usuario autenticado
      const company = await this.userService.getCompanyByUserEmail(currentUser.email)
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }
      // Buscar todos los usuarios de la empresa y sus roles
      const users = await this.userService.getUsersWithRolesByCompanyId(company.id)
      return response.ok({
        message: 'Usuarios de la empresa obtenidos exitosamente',
        data: users
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Crear un usuario para la empresa autenticada
   */
  public async createUserForCompany({ auth, request, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }
      const currentUser = await this.authService.getCurrentUser(auth.user.id)
      const company = await this.userService.getCompanyByUserEmail(currentUser.email)
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }
      const data = request.only(['firstName', 'lastName', 'email', 'username', 'password', 'roleId', 'phone'])
      const unidades = request.input('unidades', []) // arreglo de IDs de unidades residenciales
      const user = await this.userService.createUserForCompany(company.id, data, unidades)
      return response.created({ message: 'Usuario creado exitosamente', data: user })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Actualizar un usuario de la empresa autenticada
   */
  public async updateUserForCompany({ auth, request, params, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }
      const currentUser = await this.authService.getCurrentUser(auth.user.id)
      const company = await this.userService.getCompanyByUserEmail(currentUser.email)
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }
      const data = request.only(['firstName', 'lastName', 'email', 'username', 'isActive', 'roleId', 'phone', 'password'])
      const unidades = request.input('unidades', []) // arreglo de IDs de unidades residenciales
      const user = await this.userService.updateUserForCompany(company.id, params.id, data, unidades)
      return response.ok({ message: 'Usuario actualizado exitosamente', data: user })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Eliminar un usuario de la empresa autenticada
   */
  public async deleteUserForCompany({ auth, params, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }
      const currentUser = await this.authService.getCurrentUser(auth.user.id)
      const company = await this.userService.getCompanyByUserEmail(currentUser.email)
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }
      await this.userService.deleteUserForCompany(company.id, params.id)
      return response.ok({ message: 'Usuario eliminado exitosamente' })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener detalle de usuario por UUID
   */
  public async getUserDetail({ params, response }: HttpContext) {
    try {
      const user = await this.userService.getUserDetailById(params.id)
      return response.ok({
        message: 'Usuario encontrado',
        data: user
      })
    } catch (error) {
      return response.notFound({ error: error.message })
    }
  }

  
}