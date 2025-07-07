import Role from "#models/Role";



export default class RoleService {
  public async getAllRoles() {
    const roles = await Role.query()
      .select(['id', 'name', 'description', 'isActive', 'tipo_rol_id'])
      .preload('tipoRol', (query) => query.select(['id', 'nombre']))
    return roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      tipo_rol_nombre: role.tipoRol?.nombre || null
    }))
  }
}
