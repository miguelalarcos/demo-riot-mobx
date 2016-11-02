import {ws} from './wsActor.js'
import {mbx} from './mobxActor.js'
import {ui} from './uiActor.js'

ws.mbx = mbx
ui.mbx = mbx
mbx.ws = ws

console.log('connections done!')

// ws.start()
