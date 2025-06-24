// Extensión de tipos para HttpContext
declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: {
      user: {
        id: string
        email: string
        username: string
        firstName: string
        lastName?: string | null
        roles: Array<{
          id: number
          name: string
          description?: string
        }>
        permissions: Record<string, {
          featureId: number
          canView: boolean
          canCreate: boolean
          canEdit: boolean
          canDelete: boolean
        }>
      }
    }
  }
}
