import { globalModules } from './store.js';

let require = (requireId, callback) =>{
    if (typeof requireId === 'string') {
        let option = {
            name:'IIFF'
            deps:[requireId],
            factory:callback
        };
        let module = new Module(option);
    }

    if (requireId instanceof Array) {
        let option = {
            name:'IIFF',
            deps:requireId,
            factory:callback
        };
        let module = new Module(option);
    }
}



export {require}