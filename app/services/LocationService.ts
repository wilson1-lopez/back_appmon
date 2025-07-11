import Country from '#models/Country'
import Department from '#models/Department'
import City from '#models/City'
import BaseDocumentType from '#models/BaseDocumentType'
import DocumentType from '#models/DocumentType'

export default class LocationService {
  
  /**
   * Obtener todos los países
   */
  public async getAllCountries() {
    return await Country.query().orderBy('name', 'asc')
  }

  /**
   * Obtener departamentos por país
   */
  public async getDepartmentsByCountry(countryId: number) {
    const country = await Country.find(countryId)
    if (!country) {
      return null
    }

    const departments = await Department.query()
      .where('countryId', countryId)
      .orderBy('name', 'asc')

    return {
      country: {
        id: country.id,
        name: country.name,
        internationalCode: country.internationalCode,
        countryIcon: country.countryIcon
      },
      departments
    }
  }

  /**
   * Obtener ciudades por departamento
   */
  public async getCitiesByDepartment(departmentId: number) {
    const department = await Department.query()
      .where('id', departmentId)
      .preload('country')
      .first()

    if (!department) {
      return null
    }

    const cities = await City.query()
      .where('departmentId', departmentId)
      .orderBy('name', 'asc')

    return {
      country: {
        id: department.country.id,
        name: department.country.name,
        internationalCode: department.country.internationalCode,
        countryIcon: department.country.countryIcon
      },
      department: {
        id: department.id,
        name: department.name,
        daneCode: department.daneCode
      },
      cities
    }
  }

  /**
   * Obtener la jerarquía completa de un país (país -> departamentos -> ciudades)
   */
  public async getCompleteHierarchyByCountry(countryId: number) {
    const country = await Country.query()
      .where('id', countryId)
      .preload('departments', (departmentQuery) => {
        departmentQuery.preload('cities').orderBy('name', 'asc')
      })
      .first()

    if (!country) {
      return null
    }

    return country
  }

  /**
   * Obtener todos los tipos de documentos base
   */
  public async getAllBaseDocumentTypes() {
    return await BaseDocumentType.query()
      .where('status', true)
      .orderBy('name', 'asc')
  }

  /**
   * Obtener tipos de documentos por país
   */
  public async getDocumentTypesByCountry(countryId: number) {
    const country = await Country.find(countryId)
    if (!country) {
      return null
    }

    const documentTypes = await DocumentType.query()
      .where('countryId', countryId)
      .where('status', true)
      .preload('baseType')
      .orderBy('id', 'asc')

    return {
      country: {
        id: country.id,
        name: country.name,
      },
      documentTypes: documentTypes.map(dt => ({
        id: dt.id,
        baseTypeId: dt.baseTypeId,
        countryId: dt.countryId,
        status: dt.status,
        baseType: {
          id: dt.baseType.id,
          code: dt.baseType.code,
          name: dt.baseType.name,
        }
      }))
    }
  }

  /**
   * Obtener todos los tipos de documentos con información completa
   */
  public async getAllDocumentTypes() {
    const documentTypes = await DocumentType.query()
      .where('status', true)
      .preload('baseType')
      .orderBy('countryId', 'asc')
      .orderBy('baseTypeId', 'asc')

    return documentTypes.map(dt => ({
      id: dt.id,
      baseTypeId: dt.baseTypeId,
      countryId: dt.countryId,
      status: dt.status,
      baseType: {
        id: dt.baseType.id,
        code: dt.baseType.code,
        name: dt.baseType.name,
      }
    }))
  }
}
