import edge from 'edge.js'
import env from '#start/env'
import Roles from '#enums/role'

edge.global('env', env)
edge.global('Roles', Roles)
