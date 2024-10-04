/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const MoviesController = () => import('#controllers/movies_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const HomeController = () => import('#controllers/home_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', [HomeController, 'index']).as('home')

router.get('/movies', [MoviesController, 'index']).as('movies.index')
router.get('/coming', [MoviesController, 'getComing']).as('movies.coming')
router.get('/top', [MoviesController, 'getMostRated']).as('movies.top')
router.get('/movies/create', [MoviesController, 'create']).as('movies.create')
router.post('/movies/create', [MoviesController, 'store']).as('movies.store')

router.get('/movies/:slug', [MoviesController, 'show']).as('movies.show')

router
  .group(() => {
    router
      .get('/register', [RegisterController, 'show'])
      .as('register.show')
      .use(middleware.guest())
    router
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.guest())
    router.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())

    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('/auth')
  .as('auth')

router
  .group(() => {
    router
      .get('/', async ({ view }) => {
        return view.render('pages/user')
      })
      .as('index')
  })
  .prefix('/admin')
  .as('admin')
// .use(middleware.auth())
