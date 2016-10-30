import riot from 'riot'
import './app.tag'
import {newCollection} from './core.js'
import {P} from './predicate-mixin.js'

newCollection('collection')
P.register('predicateA', 'collection')

riot.mount('app')
