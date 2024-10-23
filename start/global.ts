import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as lucideIcons } from '@iconify-json/lucide'
addCollection(lucideIcons)

edge.use(edgeIconify)
