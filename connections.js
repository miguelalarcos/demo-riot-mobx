// import ws from './wsActor.js'
import {mbx} from './mobxActor.js'
import {ui} from './uiActor.js'

// ws.mbx = mbx
ui.mbx = mbx

// ws.start()
