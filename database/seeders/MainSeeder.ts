import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    
    // Import and run all seeders
    const { default: PaisSeeder } = await import('./PaisSeeder.js')
    const { default: DepartamentoSeeder } = await import('./DepartamentoSeeder.js')
    const { default: CiudadSeeder } = await import('./CiudadSeeder.js')
    const { default: TipoDocumentoBaseSeeder } = await import('./TipoDocumentoBaseSeeder.js')
    const { default: TipoDocumentoSeeder } = await import('./TipoDocumentoSeeder.js')
    const { default: TipoCompaniaSeeder } = await import('./TipoCompaniaSeeder.js')
    const { default: TipoNegocioSeeder } = await import('./TipoNegocioSeeder.js')
    const { default: RolSeeder } = await import('./RolSeeder.js')
    const { default: FuncionalidadSeeder } = await import('./FuncionalidadSeeder.js')
    const { default: PermisoSeeder } = await import('./PermisoSeeder.js')

    await new PaisSeeder(this.client).run()
    await new DepartamentoSeeder(this.client).run()
    await new CiudadSeeder(this.client).run()
    await new TipoDocumentoBaseSeeder(this.client).run()
    await new TipoDocumentoSeeder(this.client).run()
    await new TipoCompaniaSeeder(this.client).run()
    await new TipoNegocioSeeder(this.client).run()
    await new RolSeeder(this.client).run()
    await new FuncionalidadSeeder(this.client).run()
    await new PermisoSeeder(this.client).run()
  }
}