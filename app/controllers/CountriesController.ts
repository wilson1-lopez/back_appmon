import CountryService from "#services/CountryService"
import { HttpContext } from "@adonisjs/core/http"


export default class CountriesController {
  private service = new CountryService()

  public async index({ response }: HttpContext) {
    const countries = await this.service.getAllCountries()
    return response.ok(countries)
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'internationalCode', 'countryIcon'])
    const country = await this.service.createCountry(data)
    return response.created(country)
  }

  public async bulkStore({ request, response }: HttpContext) {
    const countries = request.input('countries')
    if (!Array.isArray(countries)) {
      return response.badRequest({ error: 'countries must be an array' })
    }
    const result = await this.service.bulkCreate(countries)
    return response.created(result)
  }

  public async countryWithDocumentOptions({ params, response }: HttpContext) {
    const countryId = Number(params.id)
    if (isNaN(countryId)) {
      return response.badRequest({ error: 'Invalid country id' })
    }
    const result = await this.service.getCountryWithDocumentOptions(countryId)
    if (!result) {
      return response.notFound({ error: 'Country not found' })
    }
    return response.ok(result)
  }
}
