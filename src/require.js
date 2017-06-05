import { unexpected } from './util.js';
import { globalModules } from './store.js';
import { Module } from './module.js';

let require = (requireId, callback) =>{
    let option;
    if (typeof requireId === 'string') {
        option = {
            name:'IIFF',
            deps:[requireId],
            factory:callback,
            state:-1
        };
    }else if (requireId instanceof Array) {
        option = {
            name:'IIFF',
            deps:requireId,
            factory:callback,
            state:-1
        };
    }else{
        unexpected()
    }
    let module = new Module(option)
    module.modPrepare()
}

export {require}