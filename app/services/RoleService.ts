import Role from "#models/Role";



export default class RoleService {
  public async getAllRoles() {
    const roles = await Role.query()
      .where('isActive', true)
      .select(['id', 'name', 'description', 'isActive', 'tipoNegocioId'])
      .preload('businessType', (query) => query.select(['id', 'name', 'code']))
    return roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      businessType: role.businessType ? {
        id: role.businessType.id,
        name: role.businessType.name,
        code: role.businessType.code,
      } : null
    }))
  }
}
