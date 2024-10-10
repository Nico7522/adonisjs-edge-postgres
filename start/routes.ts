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
const WatchlistsController = () => import('#controllers/watchlists_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', [HomeController, 'index']).as('home')

router.get('/movies', [MoviesController, 'index']).as('movies.index')
router.get('/coming', [MoviesController, 'getComing']).as('movies.coming')
router.get('/top', [MoviesController, 'getMostRated']).as('movies.top')
router.get('/movies/create', [MoviesController, 'create']).as('movies.create')
router.post('/movies/create', [MoviesController, 'store']).as('movies.store')

router.get('/movies/:slug', [MoviesController, 'show']).as('movies.show')

// Profile
router.get('/profile', [ProfilesController, 'index']).as('profile.index').use(middleware.auth())
router.put('/profile', [ProfilesController, 'edit']).as('profile.edit').use(middleware.auth())

router
  .post('/profile/avatar', [ProfilesController, 'updateAvatar'])
  .as('profile.updateAvatar')
  .use(middleware.auth())

// Auth
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
    // router.get('/', [WatchlistsController, 'toggle']).as('index')
  })
  .prefix('/admin')
  .as('admin')
// .use(middleware.auth())

router
  .group(() => {
    router.post('/watchlist/:slug/toggle', [WatchlistsController, 'toggle']).as('toggle')
    router
      .post('/watchlist/:slug/toggle-watched', [WatchlistsController, 'toggleWatched'])
      .as('toggle.watched')
  })
  .as('watchlist')
