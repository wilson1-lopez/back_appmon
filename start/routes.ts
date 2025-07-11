/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Importar rutas organizadas
import './routes/auth.ts'
import './routes/countries.ts'
import './routes/locations.ts'
import './routes/account.ts'
import './routes/companies.ts'
import './routes/unidades-residenciales.ts'
import './routes/user.ts'
import './routes/roles.ts'
import './routes/torres-bloques.ts'
import './routes/apartamentos.ts'
import './routes/agencias.ts'
import './routes/residentes.ts'
import './routes/propietarios.ts'
import './routes/tipos-vehiculos.ts'
import './routes/vehiculos-apartamento.ts'


