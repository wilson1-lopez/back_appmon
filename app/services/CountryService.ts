import Country from "#models/Country"
import DocumentType from "#models/DocumentType"


export default class CountryService {
  public async createCountry(data: {
    name: string
    internationalCode: string
    countryIcon?: string | null
  }) {
    const country = await Country.create({
      name: data.name,
      internationalCode: data.internationalCode,
      countryIcon: data.countryIcon ?? null,
    })
    return country
  }

  public async bulkCreate(countries: Array<{
    name: string
    internationalCode: string
    countryIcon?: string | null
  }>) {
    return await Country.createMany(countries)
  }

  public async getAllCountries() {
    return await Country.query().where('estado', true)
  }

  // ...existing methods...

  public async getCountryWithDocumentOptions(countryId: number) {
    const country = await Country.find(countryId)
    if (!country) return null

    // Traer los tipos de documento con join al tipo base
    const documents = await DocumentType
      .query()
      .where('pais_id', countryId)
      .whereHas('baseType', (query) => {
        query.where('estado', true)
      })
      .preload('baseType')

    // Mapear la respuesta
    const documentOptions = documents.map(doc => ({
      id: doc.id,
      name: doc.baseType?.name,
      code: doc.baseType?.code,
    }))

    return {
      countryName: country.name,
      documents: documentOptions,
    }
  }
}
