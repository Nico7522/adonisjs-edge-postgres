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
const ActorsController = () => import('#controllers/actors_controller')
const VerifyEmailsController = () => import('#controllers/auth/verify_emails_controller')
const DashboardController = () => import('#controllers/admin/dashboard_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import TestsController from '#controllers/tests_controller'
router.get('/test', [TestsController, 'sendEmail'])

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
    router
      .get('/verify-email/sent-back', [VerifyEmailsController, 'showSentBackVerifyEmailTokenPage'])
      .as('verify-email-sent-back.show')
      .use(middleware.guest())

    router
      .post('/verify-email/sent-back', [VerifyEmailsController, 'sentBackVerifyEmailToken'])
      .as('verify-email-sent-back.store')
      .use(middleware.guest())

    router
      .get('/verify-email', [VerifyEmailsController, 'show'])
      .as('email-sent.show')
      .use(middleware.guest())
    router
      .get('/verify-email/:token', [VerifyEmailsController, 'verify'])
      .as('verify-email.verify')
      .use(middleware.guest())
    router.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())

    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())

    router
      .get('/forgot-password', [LoginController, 'showForgotPasswordPage'])
      .as('forgot-password.show')
      .use(middleware.guest())

    router
      .post('/forgot-password', [LoginController, 'sendForgotPasswordToken'])
      .as('forgot-password.store')
      .use(middleware.guest())

    router
      .post('/reset-password/:token', [LoginController, 'resetPassword'])
      .as('forgot-password.change')
      .use(middleware.guest())

    // Show form
    router
      .get('/reset-password/:token', [LoginController, 'showResetPasswordPage'])
      .as('forgot-password.reset')
      .use(middleware.guest())
  })

  .prefix('/auth')
  .as('auth')

router
  .group(() => {
    router.get('/', [DashboardController, 'handle']).as('dashboard')
  })
  .prefix('/admin')
  .as('admin')

router
  .group(() => {
    router.post('/watchlist/:slug/toggle', [WatchlistsController, 'toggle']).as('toggle')
    router
      .post('/watchlist/:slug/toggle-watched', [WatchlistsController, 'toggleWatched'])
      .as('toggle.watched')
  })
  .as('watchlist')

router.get('/actor/:slug', [ActorsController, 'show']).as('actor.show')
