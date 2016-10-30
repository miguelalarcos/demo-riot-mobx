import riot from 'riot'
import './app.tag'
import {mbx} from './connections.js'
// import {newCollection} from './core.js'
// import {P} from './predicate-mixin.js'

mbx.newCollection('collection')
mbx.register('predicateA', 'collection')

riot.mount('app')
