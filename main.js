import './connections.js'
import {mbx} from './mobxActor.js'
import riot from 'riot'
import './_app.tag'

mbx.newCollection('collection')
mbx.register('predicateA', 'collection')

riot.mount('app')
