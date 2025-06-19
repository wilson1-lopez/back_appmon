import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const { default: Permission } = await import('#models/Permission')
    
    await Permission.createMany([
      // Administrator - full permissions
      { roleId: 1, featureId: 1, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { roleId: 1, featureId: 2, canView: true, canCreate: true, canEdit: true, canDelete: true },
      { roleId: 1, featureId: 3, canView: true, canCreate: true, canEdit: true, canDelete: true },
      
      // Supervisor - limited permissions
      { roleId: 2, featureId: 1, canView: true, canCreate: false, canEdit: true, canDelete: false },
      { roleId: 2, featureId: 2, canView: true, canCreate: true, canEdit: true, canDelete: false },
      { roleId: 2, featureId: 3, canView: true, canCreate: false, canEdit: false, canDelete: false },
      
      // User - read only
      { roleId: 3, featureId: 3, canView: true, canCreate: false, canEdit: false, canDelete: false }
    ])
  }
}