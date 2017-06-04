import { globalModules } from './store.js';

let require = (requireId, callback) =>{
    if (typeof requireId === 'string') {
        let option = {
            name:'IIFF'
            deps:[requireId],
            factory:callback,
            state:-1
        };
    }else if (requireId instanceof Array) {
        let option = {
            name:'IIFF',
            deps:requireId,
            factory:callback,
            state:-1
        };
    }else{
        this.unexpected()
    }
    let module = new Module(option)
    module.modPrepare()
}

export {require}