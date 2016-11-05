import EventEmitter from 'eventemitter2'

export class Actor extends EventEmitter {
    constructor(){
        super()
        this.on('msg', (method, args)=>{
            console.log('on', method, args)
            this[method](args)
        })
    }
    tell(method, args){
        console.log('tell', method, args)
        this.emit('msg', method, args)
    }
}

